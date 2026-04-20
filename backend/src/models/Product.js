const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0
    },
    company: {
        type: String,
        required: true,
        trim: true
    }
}, { 
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } 
});

module.exports = mongoose.model('Product', productSchema);
