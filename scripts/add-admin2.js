require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
});

async function run() {
  let log = '';
  try {
    const uri = process.env.MONGODB_URI;
    log += 'URI: ' + (uri ? 'Loaded' : 'Missing') + '\n';
    await mongoose.connect(uri);
    log += 'Connected to DB!\n';
    
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
    log += 'Admin user updated in DB.\n';
    fs.writeFileSync('result.txt', log, 'utf8');
    process.exit(0);
  } catch (err) {
    log += 'Error: ' + err.toString() + '\n';
    fs.writeFileSync('result.txt', log, 'utf8');
    process.exit(1);
  }
}
run();
