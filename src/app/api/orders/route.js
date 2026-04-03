import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    
    if (user.role !== 'admin') {
      query.user = user.userId;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Please login to place an order' }, { status: 401 });
    }

    await dbConnect();
    const { items, paymentMethod, deliveryAddress, deliveryZone, phone, customerName, transactionId, senderNumber, notes } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!deliveryAddress || !deliveryZone || !phone || !customerName) {
      return NextResponse.json({ error: 'Please provide all delivery details' }, { status: 400 });
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!transactionId || !senderNumber)) {
      return NextResponse.json({ error: 'Transaction ID and Sender Number are required for mobile payment' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      // Pre-orders are allowed, so we allow negative stock to act as a backorder counter

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const deliveryCharge = deliveryZone === 'RUET Campus' ? 50 : 100;
    const grandTotal = totalAmount + deliveryCharge;

    const order = await Order.create({
      user: user.userId,
      items: orderItems,
      totalAmount,
      deliveryCharge,
      grandTotal,
      paymentMethod,
      paymentStatus: 'pending', // Manual verification needed
      transactionId: transactionId || '',
      senderNumber: senderNumber || '',
      deliveryAddress,
      deliveryZone,
      phone,
      customerName,
      notes: notes || '',
    });

    return NextResponse.json({ order, message: 'Order placed successfully!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
