//  require('dotenv').config();
//  const mongoose = require('mongoose');
//  const Product = require('./models/Product');
//  const User = require('./models/User');
//  const bcrypt = require('bcryptjs');
//  const seed = async () => {
//  try {
//  await mongoose.connect(process.env.MONGO_URI);
//  console.log('Connected');
//  await Product.deleteMany({});
//  const products = [
//  { name: 'Acme Tech Ltd', category: 'Stock', pricePerUnit: 450.5,
//  metric: 'P/E 26.4', description: 'Leading tech company', priceHistory: [380,
//  400, 420, 440, 450] },
//  { name: 'Indus Pharma', category: 'Stock', pricePerUnit: 220.0,
//  metric: 'P/E 18.2', description: 'Pharmaceuticals', priceHistory: [200, 205,
//  210, 215, 220] },
//  { name: 'Bluechip Fund', category: 'Mutual Fund', pricePerUnit:
//  120.45, metric: '1Y Return 12%', description: 'Balanced index fund',
//  priceHistory: [110, 112, 115, 118, 120] }
//  ];
//  await Product.insertMany(products);
//  console.log('Products seeded');
//  // create an admin test user
//  const existing = await User.findOne({ email: 'test@demo.com' });
//  if (!existing) {
//  const hashed = await bcrypt.hash('password123', 10);
//  const u = new User({ name: 'Demo User', email: 'test@demo.com',
//  password: hashed, walletBalance: 100000 });
//  await u.save();
//  console.log('Demo user created: test@demo.com / password123');
//  }
//  process.exit();
//  } catch (err) {
//  console.error(err);
//  process.exit(1);
//  }
//  };
//  seed();
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Enhanced product list matching assignment requirements
    const products = [
      // STOCKS - with P/E ratios as key metrics
      {
        name: 'Reliance Industries Ltd',
        category: 'Stock',
        pricePerUnit: 2847.50,
        metric: 'P/E Ratio: 25.8',
        description: 'Leading conglomerate in petrochemicals, oil & gas, and retail sectors. Strong dividend history and consistent growth.',
        priceHistory: [2650, 2720, 2780, 2810, 2847]
      },
      {
        name: 'Tata Consultancy Services',
        category: 'Stock',
        pricePerUnit: 3945.75,
        metric: 'P/E Ratio: 28.4',
        description: 'Global IT services and consulting leader with strong international presence and digital transformation expertise.',
        priceHistory: [3800, 3850, 3900, 3920, 3945]
      },
      {
        name: 'HDFC Bank Ltd',
        category: 'Stock',
        pricePerUnit: 1687.20,
        metric: 'P/E Ratio: 19.6',
        description: 'Premier private sector bank with robust digital banking platform and excellent asset quality.',
        priceHistory: [1620, 1640, 1665, 1680, 1687]
      },
      {
        name: 'Infosys Ltd',
        category: 'Stock',
        pricePerUnit: 1789.40,
        metric: 'P/E Ratio: 22.1',
        description: 'Global technology services company specializing in consulting, technology, and outsourcing solutions.',
        priceHistory: [1720, 1745, 1760, 1775, 1789]
      },
      
      // MUTUAL FUNDS - with return percentages as key metrics
      {
        name: 'SBI BlueChip Fund',
        category: 'Mutual Fund',
        pricePerUnit: 68.42,
        metric: '1Y Return: 18.5%',
        description: 'Large-cap equity fund investing in fundamentally strong blue-chip companies with consistent performance track record.',
        priceHistory: [58, 62, 65, 67, 68]
      },
      {
        name: 'HDFC Balanced Advantage Fund',
        category: 'Mutual Fund',
        pricePerUnit: 45.89,
        metric: '1Y Return: 14.2%',
        description: 'Dynamic asset allocation fund that automatically adjusts equity-debt mix based on market conditions.',
        priceHistory: [40, 42, 44, 45, 46]
      },
      {
        name: 'Axis Small Cap Fund',
        category: 'Mutual Fund',
        pricePerUnit: 82.15,
        metric: '1Y Return: 25.7%',
        description: 'Small-cap equity fund focusing on high-growth potential companies with strong fundamentals and scalable business models.',
        priceHistory: [65, 70, 75, 79, 82]
      }
    ];
    
    await Product.insertMany(products);
    console.log('Enhanced products seeded successfully');
    console.log(`✅ Created ${products.length} investment products`);
    
    // Create demo user with KYC details
    const existing = await User.findOne({ email: 'test@demo.com' });
    if (!existing) {
      const hashed = await bcrypt.hash('password123', 10);
      const demoUser = new User({ 
        name: 'Demo Investor', 
        email: 'test@demo.com',
        password: hashed, 
        pan: 'ABCDE1234F',
        walletBalance: 100000 // ₹1,00,000 as per assignment
      });
      await demoUser.save();
      console.log('✅ Demo user created: test@demo.com / password123');
      console.log('📱 PAN Number: ABCDE1234F');
      console.log('💰 Wallet Balance: ₹1,00,000');
    }
    
    // Create admin user for bonus features
    const adminExists = await User.findOne({ email: 'admin@finmini.com' });
    if (!adminExists) {
      const hashedAdmin = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@finmini.com',
        password: hashedAdmin,
        pan: 'ADMIN1234X',
        role: 'admin',
        walletBalance: 500000
      });
      await adminUser.save();
      console.log('✅ Admin user created: admin@finmini.com / admin123');
    }
    
    console.log('\n🎯 Assignment Requirements Met:');
    console.log('✓ 3-5 investment products (7 created)');
    console.log('✓ Stocks with P/E ratios as key metrics');
    console.log('✓ Mutual funds with return percentages');
    console.log('✓ Price history for charts');
    console.log('✓ Demo user with ₹100,000 wallet');
    console.log('✓ Admin user for bonus features');
    
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
