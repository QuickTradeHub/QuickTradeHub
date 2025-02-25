const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category")
const multer = require("multer");
const AWS = require("aws-sdk");
const router = express.Router();
require('dotenv').config()

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "eu-north-1",
});

// Configure multer for file upload handling (for images)
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // Limit size to 10MB
});

const s3 = new AWS.S3()

// Upload to S3
const uploadToS3 = async (fileBuffer, fileName) => {
  const params = {
    Bucket: "quicktradehub", // Your S3 bucket name
    Key: fileName, // File name in S3
    Body: fileBuffer, // File content
    ContentType: 'image/jpeg', // Correct content type for images
    ACL: 'public-read', // Set permissions to allow public access
  };
  
  try {
    const result = await s3.upload(params).promise();
    return result.Location; // Return the URL of the uploaded file
  } catch (err) {
    console.log(err.message);
    throw new Error("S3 upload failed: " + err.message);
  }
};

// Generate SKU asynchronously and concurrently with image upload
const generateSKU = async (productData) => {
  const cat = await Category.findById(productData.category);
  const categoryPrefix = cat.name.substring(0, 3).toUpperCase(); // First 3 characters of category name
  const productNamePrefix = productData.title.substring(0, 3).toUpperCase(); // First 3 characters of product name
  const timestamp = Date.now(); // Current timestamp for uniqueness
  const randomNum = Math.floor(Math.random() * 10000); // Random number to ensure uniqueness

  // Construct the SKU
  return `${categoryPrefix}-${productNamePrefix}-${timestamp}-${randomNum}`;
};

// ✅ Add a new product with multiple images and a thumbnail
router.post("/", upload.fields([
  { name: 'images', maxCount: 5 },  // For multiple images
  { name: 'thumbnail', maxCount: 1 }  // For thumbnail image
]), async (req, res) => {
  try {
    let imageUrls = [];
    let thumbnailUrl = null;

    // Upload images to S3 concurrently
    const uploadImagePromises = req.files['images'] ? req.files['images'].map(image => {
      return uploadToS3(image.buffer, `${Date.now()}_${image.originalname}`);
    }) : [];
    imageUrls = await Promise.all(uploadImagePromises); // Wait for all images to be uploaded concurrently

    // Upload thumbnail to S3 concurrently
    if (req.files['thumbnail']) {
      const thumbnail = req.files['thumbnail'][0];
      thumbnailUrl = await uploadToS3(thumbnail.buffer, `${Date.now()}_${thumbnail.originalname}`);
    }

    // Generate SKU concurrently
    const sku = await generateSKU(req.body);

    // Create product with the image URLs and other data
    const product = new Product({
      ...req.body,
      sku: sku,
      images: imageUrls, // Array of image URLs
      thumbnail: thumbnailUrl, // Thumbnail URL
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Error creating product", message: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query = "", page = 1, limit = 10 } = req.query;

    // Use regex for case-insensitive search
    const regexQuery = new RegExp(query, 'i');

    // Set up the aggregation pipeline for more advanced searching
    const products = await Product.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: regexQuery } },
            { description: { $regex: regexQuery } },
            { "category.name": { $regex: regexQuery } },
            { brand: { $regex: regexQuery } },
            { sku: { $regex: regexQuery } },
            { condition: { $regex: regexQuery } },
            { tags: { $regex: regexQuery } },
          ],
        },
      },
      {
        $addFields: {
          score: {
            $sum: [
              { $cond: [{ $regexMatch: { input: "$title", regex: regexQuery } }, 1, 0] },
              { $cond: [{ $regexMatch: { input: "$description", regex: regexQuery } }, 0.5, 0] },
              { $cond: [{ $regexMatch: { input: "$brand", regex: regexQuery } }, 0.3, 0] },
              { $cond: [{ $regexMatch: { input: "$sku", regex: regexQuery } }, 0.2, 0] },
            ],
          },
        },
      },
      { $sort: { score: -1 } }, // Sort by score (higher relevance first)
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "categories", // Assuming category collection name is 'categories'
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products", message: err.message });
  }
});



// ✅ Get all products (with pagination, category population, and reviews)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find()
      .populate("category") // Populate category details
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products", message: err.message });
  }
});

// ✅ Get a single product by ID (with category and reviews)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error fetching product", message: err.message });
  }
});

// ✅ Update a product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("category"); // Populate category details
    
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Error updating product", message: err.message });
  }
});

// ✅ Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting product", message: err.message });
  }
});

// ✅ Update product stock (atomic update)
router.patch("/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { stock } },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Error updating stock", message: err.message });
  }
});

// ✅ Add a review to a product
router.post("/:id/review", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const { userId, rating, comment } = req.body;

    const review = {
      userId,
      rating,
      comment,
      createdAt: new Date()
    };

    product.reviews.push(review);

    await product.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    res.status(400).json({ error: "Error adding review", message: err.message });
  }
});

// ✅ Get all reviews for a product
router.get("/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product.reviews);
  } catch (err) {
    res.status(500).json({ error: "Error fetching reviews", message: err.message });
  }
});

// ✅ Get all products of a specific seller (with pagination, category population, and reviews)
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const {sellerId} = req.params;
    const products = await Product.find({sellerId})
      .populate("category") // Populate category details
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products", message: err.message });
  }
});

// ✅ Get all products by category ID
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find({ category: categoryId })
      .populate("category") // Populate category details
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products by category", message: err.message });
  }
});




module.exports = router;
