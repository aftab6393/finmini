// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();


// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');
// const transactionRoutes = require('./routes/transactions');
// const userRoutes = require('./routes/users');


// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/users', userRoutes);


// const PORT = process.env.PORT || 5000;


// mongoose
// .connect(process.env.MONGO_URI)
// .then(() => {
// console.log('Connected to MongoDB');
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
// .catch((err) => console.error(err));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/users');

const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Simulate real-time price updates every 30 seconds
setInterval(() => {
  const priceUpdates = {
    productId: 'sample-product',
    newPrice: (Math.random() * 1000 + 2000).toFixed(2),
    timestamp: new Date()
  };
  console.log('📈 Broadcasting price update:', priceUpdates);
  io.emit('priceUpdate', priceUpdates);
}, 30000);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('🔌 Socket.IO enabled for real-time updates');
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
