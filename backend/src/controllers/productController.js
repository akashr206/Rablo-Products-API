const Product = require('../models/Product');

const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { productId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ productId: req.params.id });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ featured: true });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByPrice = async (req, res) => {
    try {
        const priceLimit = parseFloat(req.params.price);
        const products = await Product.find({ price: { $lt: priceLimit } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByRating = async (req, res) => {
    try {
        const ratingLimit = parseFloat(req.params.rating);
        const products = await Product.find({ rating: { $gt: ratingLimit } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getProductsByPrice,
    getProductsByRating
};