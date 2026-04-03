const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb://screwedone7_db_user:rifat123@ac-xsxiwej-shard-00-00.pry7k64.mongodb.net:27017,ac-xsxiwej-shard-00-01.pry7k64.mongodb.net:27017,ac-xsxiwej-shard-00-02.pry7k64.mongodb.net:27017/brixel?ssl=true&replicaSet=atlas-gd6vzi-shard-0&authSource=admin&retryWrites=true&w=majority&appName=taha";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, default: 'customer' },
});

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    const adminEmail = 'admin@brixel.com';
    const existing = await User.findOne({ email: adminEmail });
    
    if (existing) {
      console.log('Admin already exists. Updating password...');
      const hashedPassword = await bcrypt.hash('admin12345', 12);
      await User.updateOne({ email: adminEmail }, { password: hashedPassword, role: 'admin', name: 'Brixel Admin' });
    } else {
      console.log('Creating new admin...');
      const hashedPassword = await bcrypt.hash('admin12345', 12);
      await User.create({
        name: 'Brixel Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
    }
    
    console.log('Admin user seeded successfully!');
    console.log('Email: admin@brixel.com');
    console.log('Password: admin12345');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seed();
