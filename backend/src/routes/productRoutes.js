const express = require('express');
const router = express.Router();
const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protectedRoute } = require('../middlewares/authMiddleware');

router.get('/',protectedRoute, getAllProducts);


router.post('/' , protectedRoute,addProduct);
router.put('/:id' ,protectedRoute, updateProduct);
router.delete('/:id',protectedRoute, deleteProduct);

module.exports = router;
