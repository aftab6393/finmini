const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');


// Buy product
router.post('/buy', auth, async (req, res) => {
try {
const { productId, units } = req.body;
const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: 'Product not found' });


const unitsNum = Number(units);
if (!unitsNum || unitsNum <= 0) return res.status(400).json({ message: 'Invalid units' });


const total = unitsNum * product.pricePerUnit;
if (req.user.walletBalance < total) return res.status(400).json({ message: 'Insufficient balance' });


// Deduct
req.user.walletBalance -= total;
await req.user.save();


const tx = new Transaction({ user: req.user._id, product: product._id, units: unitsNum, priceAtPurchase: product.pricePerUnit, totalAmount: total });
await tx.save();


res.json({ message: 'Purchase successful', tx, walletBalance: req.user.walletBalance });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;