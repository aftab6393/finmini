const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


module.exports = async (req, res, next) => {
try {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ message: 'No token provided' });


const token = header.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id);
if (!user) return res.status(401).json({ message: 'Invalid token' });


req.user = user;
next();
} catch (err) {
console.error(err);
res.status(401).json({ message: 'Unauthorized' });
}
};