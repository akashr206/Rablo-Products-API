const Product = require('../models/Product');

const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPaginatedProducts = async (query, req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        limit
    };
};

const getAllProducts = async (req, res) => {
    try {
        const result = await getPaginatedProducts({}, req);
        res.json(result);
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
        const result = await getPaginatedProducts({ featured: true }, req);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByPrice = async (req, res) => {
    try {
        const priceLimit = parseFloat(req.params.price);
        const result = await getPaginatedProducts({ price: { $lt: priceLimit } }, req);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByRating = async (req, res) => {
    try {
        const ratingLimit = parseFloat(req.params.rating);
        const result = await getPaginatedProducts({ rating: { $gt: ratingLimit } }, req);
        res.json(result);
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