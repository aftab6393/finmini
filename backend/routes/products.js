const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


// List products
router.get('/', async (req, res) => {
try {
const products = await Product.find().lean();
res.json(products);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// Product detail
router.get('/:id', async (req, res) => {
try {
const p = await Product.findById(req.params.id);
if (!p) return res.status(404).json({ message: 'Not found' });
res.json(p);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;