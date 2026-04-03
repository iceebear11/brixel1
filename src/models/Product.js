import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['drafting-tools', 'model-making', 'drawing-materials', 'measuring', 'safety', 'other'],
  },
  image: {
    type: String,
    default: '/placeholder-product.png',
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    // No min constraint - negative values represent pre-orders/backorders
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
