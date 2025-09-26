 const express = require('express');
 const router = express.Router();
 const auth = require('../middleware/auth');
 const Transaction = require('../models/Transaction');
 const Product = require('../models/Product');
 const User = require('../models/User');
 // Portfolio summary
 router.get('/portfolio', auth, async (req, res) => {
 try {
 const transactions = await Transaction.find({ user:
 req.user._id }).populate('product');
 // Aggregate holdings by product
 const holdings = {};
 let totalInvested = 0;
 transactions.forEach((t) => {
 totalInvested += t.totalAmount;
 const pid = t.product._id.toString();
 if (!holdings[pid]) holdings[pid] = { product: t.product, units: 0,
 invested: 0 };
 holdings[pid].units += t.units;
 holdings[pid].invested += t.totalAmount;
 });
 // Current value using latest product.pricePerUnit
 let currentValue = 0;
 const holdingArr = Object.values(holdings).map((h) => {
 const nowVal = h.units * h.product.pricePerUnit;
 currentValue += nowVal;
 return {
 product: h.product,
 units: h.units,
 invested: h.invested,
 currentValue: nowVal
 };
 });
 res.json({ walletBalance: req.user.walletBalance, totalInvested,
 currentValue, returns: currentValue-totalInvested, holdings: holdingArr });
 } catch (err) {
 console.error(err);
 res.status(500).json({ message: 'Server error' });
 }
 });
 // Watchlist add/remove toggle
 router.post('/watchlist/:productId', auth, async (req, res) => {
 try {
 const { productId } = req.params;
 const idx = req.user.watchlist.findIndex((p) => p.toString() ===
 productId);
 if (idx ===-1) {
 req.user.watchlist.push(productId);
 await req.user.save();
 return res.json({ message: 'Added to watchlist' });
 }
 req.user.watchlist.splice(idx, 1);
 await req.user.save();
 res.json({ message: 'Removed from watchlist' });
 } catch (err) {
 console.error(err);
 res.status(500).json({ message: 'Server error' });
 }
 });
 // Get user watchlist (simple)
 router.get('/watchlist', auth, async (req, res) => {
 try {await req.user.populate('watchlist');
 res.json({ watchlist: req.user.watchlist });
 } catch (err) {
 console.error(err);
 res.status(500).json({ message: 'Server error' });
 }
 });
 module.exports = router;