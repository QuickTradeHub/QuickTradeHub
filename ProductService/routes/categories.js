const express = require("express");
const Category = require("../models/category");

const router = express.Router();

// ✅ Add a new category
router.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    res.status(400).json({ error: "Error creating category", message: err.message });
  }
});

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Error fetching categories", message: err.message });
  }
});

// ✅ Get a specific category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Error fetching category", message: err.message });
  }
});

// ✅ Update a category by ID
router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category updated successfully", category });
  } catch (err) {
    res.status(400).json({ error: "Error updating category", message: err.message });
  }
});

// ✅ Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting category", message: err.message });
  }
});

module.exports = router;
