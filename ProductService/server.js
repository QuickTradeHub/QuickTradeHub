const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error: ', err);
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});
const Category = mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'] },
    sellerId: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});
const Product = mongoose.model('Product', productSchema);

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

// Add a new category
app.post('/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (err) {
        res.status(400).send({ error: 'Error while creating category', message: err.message });
    }
});

// Get all categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (err) {
        res.status(500).send({ error: 'Error while fetching categories', message: err.message });
    }
});

// Add a new product
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send({ error: 'Error while creating product', message: err.message });
    }
});

// ✅ Get All Product Categories
app.get('/products/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.send(categories);
    } catch (err) {
        res.status(500).send({ error: 'Error while fetching categories', message: err.message });
    }
});
// Get details of product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('reviews');
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (err) {
        res.status(500).send({ error: 'Error while fetching product', message: err.message });
    }
});

// Update product details
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (err) {
        res.status(400).send({ error: 'Error while updating product', message: err.message });
    }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.send({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error while deleting product', message: err.message });
    }
});

// Add a review for a product
app.post('/products/:id/review', async (req, res) => {
    try {
        const review = new Review({ ...req.body, productId: req.params.id });
        await review.save();
        await Product.findByIdAndUpdate(req.params.id, { $push: { reviews: review._id } });
        res.send(review);
    } catch (err) {
        res.status(400).send({ error: 'Error while adding review', message: err.message });
    }
});

// Get all reviews for a product
app.get('/products/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id });
        res.send(reviews);
    } catch (err) {
        res.status(500).send({ error: 'Error while fetching reviews', message: err.message });
    }
});

// ✅ Update a Specific Review
app.put('/products/:productId/reviews/:reviewId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).send('Product not found');

        const review = product.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).send('Review not found');

        Object.assign(review, req.body);
        await product.save();
        res.send(product);
    } catch (err) {
        res.status(400).send({ error: 'Error while updating review', message: err.message });
    }
});

// ✅ Delete a Specific Review
app.delete('/products/:productId/reviews/:reviewId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).send('Product not found');

        product.reviews = product.reviews.filter(r => r._id.toString() !== req.params.reviewId);
        await product.save();
        res.send({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error while deleting review', message: err.message });
    }
});



// Get all products added by a specific seller
app.get('/products/seller/:id', async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.id });
        res.send(products);
    } catch (err) {
        res.status(500).send({ error: 'Error while fetching products', message: err.message });
    }
});

// ✅ Get All Products with Pagination
app.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await Product.find()
            .limit(limit * 1)
            .skip((page - 1) * limit);
        res.send(products);
    } catch (err) {
        res.status(500).send({ error: 'Error while fetching products', message: err.message });
    }
});


// Update stock quantity for a product
app.patch('/products/:id/stock', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        product.stock = req.body.stock;
        await product.save();
        res.send(product);
    } catch (err) {
        res.status(400).send({ error: 'Error while updating stock', message: err.message });
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB disconnected on app termination');
        process.exit(0);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
