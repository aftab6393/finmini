// backend/middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Add admin routes to see all users & transactions
app.get('/api/admin/users', auth, adminAuth, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});
