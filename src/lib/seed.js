require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/materiqo';

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: { type: String, default: '/placeholder-product.png' },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    // Create admin user
    const adminPassword = await bcrypt.hash('rifat321', 12);
    await User.findOneAndUpdate(
      { email: 'admin@materiqo.com' },
      {
        name: 'Materiqo Admin',
        email: 'admin@materiqo.com',
        password: adminPassword,
        phone: '01840150075',
        role: 'admin',
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin user created: admin@materiqo.com / rifat321');

    // Create sample products
    const sampleProducts = [
      {
        name: 'Professional T-Square 36"',
        description: 'High-quality transparent acrylic T-square, 36 inches long. Perfect for precise drafting and technical drawing. Features clear graduations and smooth edges for clean lines. Essential tool for every architecture student.',
        price: 450,
        category: 'drafting-tools',
        stock: 25,
        featured: true,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400',
      },
      {
        name: 'Set Square Pack (30°-60° & 45°)',
        description: 'Professional grade set square pack containing both 30°-60° and 45° triangles. Made from premium transparent acrylic with precise angle marking. Includes protective case.',
        price: 280,
        category: 'drafting-tools',
        stock: 40,
        featured: true,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      },
      {
        name: 'Architectural Scale Ruler 30cm',
        description: 'Multi-scale triangular ruler with 6 different scales (1:20, 1:25, 1:50, 1:75, 1:100, 1:125). Made from high-quality aluminum alloy. Essential for reading and creating architectural drawings.',
        price: 320,
        category: 'drafting-tools',
        stock: 30,
        featured: true,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      },
      {
        name: 'Premium Foam Board Pack (A2, 5 Sheets)',
        description: 'Premium quality white foam board, A2 size, 5mm thickness. Pack of 5 sheets. Perfect for architectural model making, presentations, and mounting artwork. Lightweight and easy to cut.',
        price: 350,
        category: 'model-making',
        stock: 50,
        featured: true,
        image: 'https://images.unsplash.com/photo-1560690816-9e2d tried?w=400',
      },
      {
        name: 'OLFA Rotary Cutter + Blades Set',
        description: 'Professional OLFA cutting tool set with ergonomic handle and 10 replacement blades. Perfect for precise cuts in foam board, card stock, and other model-making materials.',
        price: 550,
        category: 'model-making',
        stock: 20,
        featured: false,
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      },
      {
        name: 'UHU All Purpose Glue Set',
        description: 'UHU glue collection including all-purpose glue, super glue, and stick glue. Essential adhesive kit for model making and craft projects. German quality, reliable bonding.',
        price: 220,
        category: 'model-making',
        stock: 60,
        featured: false,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      },
      {
        name: 'Staedtler Mars Technico Pencil Set',
        description: 'Professional technical pencil set with 2mm lead holders. Includes HB, H, 2H, B, and 2B leads. Premium German engineering for precise architectural drawings.',
        price: 680,
        category: 'drawing-materials',
        stock: 15,
        featured: true,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      },
      {
        name: 'Copic Marker Set (36 Colors)',
        description: 'Professional Copic markers set with 36 architectural colors. Dual-tip design (broad and fine). Refillable and replaceable nibs. Industry standard for architectural rendering.',
        price: 4500,
        category: 'drawing-materials',
        stock: 8,
        featured: true,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      },
      {
        name: 'A3 Tracing Paper Pad (50 Sheets)',
        description: 'High transparency A3 tracing paper pad with 50 sheets. 90gsm weight ideal for detailed tracing, overlaying, and architectural sketching.',
        price: 180,
        category: 'drawing-materials',
        stock: 45,
        featured: false,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      },
      {
        name: 'Laser Distance Meter 50m',
        description: 'Digital laser distance meter with 50m range. Features area/volume calculation, Pythagorean measurement, and memory storage. Perfect for site measurements and surveys.',
        price: 2200,
        category: 'measuring',
        stock: 12,
        featured: false,
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
      },
      {
        name: 'Self Healing Cutting Mat A2',
        description: 'Double-sided self-healing cutting mat, A2 size. Features grid lines in cm and inches. Protects your work surface while providing precise cutting guidance for model making.',
        price: 480,
        category: 'model-making',
        stock: 25,
        featured: false,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      },
      {
        name: 'Drafting Compass Professional Set',
        description: 'Professional compass set with bow compass, beam compass, and dividers. Spring mechanism for precise radius setting. Includes extension bar for larger circles.',
        price: 850,
        category: 'drafting-tools',
        stock: 18,
        featured: false,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400',
      },
    ];

    for (const product of sampleProducts) {
      await Product.findOneAndUpdate(
        { name: product.name },
        product,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${sampleProducts.length} sample products created`);

    console.log('\n🎉 Seed complete!');
    console.log('Admin login: admin@materiqo.com / rifat321');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
