require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
});

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('URI:', uri ? 'Loaded' : 'Missing');
    await mongoose.connect(uri);
    console.log('Connected to DB!');
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
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
    console.log('Admin user updated in DB.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
run();
