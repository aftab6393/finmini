const mongoose = require('mongoose');
 const productSchema = new mongoose.Schema(
 {
 name: { type: String, required: true },
 category: { type: String },
 pricePerUnit: { type: Number, required: true },
 metric: { type: String },
 description: { type: String },
 // priceHistory is an array of numbers representing historical prices for the chart
 priceHistory: { type: [Number], default: [] }
 },
 { timestamps: true }
 );
 module.exports = mongoose.model('Product', productSchema);