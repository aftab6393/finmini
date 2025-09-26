 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 const userSchema = new Schema(
 {
 name: { type: String, required: true },
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 pan: { type: String },
 kycImage: { type: String },
 walletBalance: { type: Number, default: 100000 },
 watchlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
 role: { type: String, default: 'user' }
 },
 { timestamps: true }
 );
 module.exports = mongoose.model('User', userSchema);