const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  role: String,
  password: { type: String, select: true }
});

async function check() {
  const uri = "mongodb://screwedone7_db_user:rifat123@ac-xsxiwej-shard-00-00.pry7k64.mongodb.net:27017,ac-xsxiwej-shard-00-01.pry7k64.mongodb.net:27017,ac-xsxiwej-shard-00-02.pry7k64.mongodb.net:27017/brixel?ssl=true&replicaSet=atlas-gd6vzi-shard-0&authSource=admin&retryWrites=true&w=majority&appName=taha";
  try {
    await mongoose.connect(uri);
    console.log('Connected');
    const User = mongoose.model('User', UserSchema);
    const users = await User.find({ email: /admin/i });
    console.log('Users found:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
