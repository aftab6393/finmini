const mongoose = require('mongoose');
 4
const transactionSchema = new mongoose.Schema(
 {
 user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:
 true },
 product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product',
 required: true },
 units: { type: Number, required: true },
 priceAtPurchase: { type: Number, required: true },
 totalAmount: { type: Number, required: true }
 },
 { timestamps: true }
 );
 module.exports = mongoose.model('Transaction', transactionSchema);