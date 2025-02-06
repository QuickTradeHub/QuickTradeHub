const express = require("express");
const Product = require("../models/product");
const multer = require("multer");
const AWS = require("aws-sdk");
const router = express.Router();

AWS.config.update({
  accessKeyId: "AKIAX3DNHWB7SQHC4ZEE",
  secretAccessKey: "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",
  region: "eu-north-1",
});

// Configure multer for file upload handling (for images)
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // Limit size to 10MB
});

// AWS S3 setup (ensure you configure your AWS credentials)
const s3 = new AWS.S3();

const uploadToS3 = async (fileBuffer, fileName) => {
  const params = {
    Bucket: "quicktradehub", // Your S3 bucket name
    Key: fileName, // File name in S3
    Body: fileBuffer, // File content
    ContentType: 'image/jpeg', // or your image type
    ACL: 'public-read', // Set permissions to allow public access
  };
  
  try {
    const result = await s3.upload(params).promise();
    return result.Location; // Return the URL of the uploaded file
  } catch (err) {
    console.log(err.message)
    throw new Error("S3 upload failed: " + err.message);
    
  }
};

// ✅ Add a new product with multiple images and a thumbnail
router.post("/", upload.fields([
  { name: 'images', maxCount: 5 },  // For multiple images
  { name: 'thumbnail', maxCount: 1 }  // For thumbnail image
]), async (req, res) => {
  try {
    let imageUrls = [];
    let thumbnailUrl = null;



    // Upload images to S3
    if (req.files['images']) {
      for (const image of req.files['images']) {
        const imageUrl = await uploadToS3(image.buffer, `${Date.now()}_${image.originalname}`);
        imageUrls.push(imageUrl);
      }
    }

    // Upload thumbnail to S3
    
    if (req.files['thumbnail']) {
      const thumbnail = req.files['thumbnail'][0];
      thumbnailUrl = await uploadToS3(thumbnail.buffer, `${Date.now()}_${thumbnail.originalname}`);
    }

    // Create product with the image URLs and other data
    const product = new Product({
      ...req.body,
      images: imageUrls, // Array of image URLs
      thumbnail: thumbnailUrl, // Thumbnail URL
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Error creating product", message: err.message });
  }
});

// Your existing code continues here...

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

module.exports = router;
