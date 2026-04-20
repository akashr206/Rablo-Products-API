const express = require('express');
const router = express.Router();
const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getProductsByPrice,
    getProductsByRating
} = require('../controllers/productController');
const { protectedRoute } = require('../middlewares/authMiddleware');

router.get('/',protectedRoute, getAllProducts);
router.get('/featured' ,protectedRoute  , getFeaturedProducts);
router.get('/price-less-than/:price' ,  protectedRoute, getProductsByPrice);
router.get('/rating-higher-than/:rating'  , protectedRoute, getProductsByRating);


router.post('/' , protectedRoute,addProduct);
router.put('/:id' ,protectedRoute, updateProduct);
router.delete('/:id',protectedRoute, deleteProduct);

module.exports = router;
