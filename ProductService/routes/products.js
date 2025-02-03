const express = require("express");
const Product = require("../models/product");
const router = express.Router();

// ✅ Add a new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Error creating product", message: err.message });
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
      // Find the product by its ID
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
  
      const { userId, rating, comment } = req.body;
  
      // Create the review object
      const review = {
        userId,
        rating,
        comment,
        createdAt: new Date() // Optionally add a createdAt field to track when the review was added
      };
  
      // Add the review to the product's reviews array
      product.reviews.push(review);
  
      // Save the product with the new review
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
