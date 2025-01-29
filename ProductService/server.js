
const express = require('express');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());

mongoose.set('strictQuery', false); 

mongoose.connect('mongodb://localhost:27017/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    sellerId: String,
    reviews: [
        {
            userId: String,
            rating: Number,
            comment: String,
            date: { type: Date, default: Date.now },
        },
    ],
});

const Product = mongoose.model('Product', productSchema);



// Add a new product
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get details of product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update product details
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.send({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
