
'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start adding some architectural equipment to your cart!</p>
          <Link href="/products" className="btn-primary btn-lg">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>🛒 Shopping Cart ({cartCount} items)</h1>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image || '/placeholder-product.png'} alt={item.name} />
            </div>
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <div className="price">৳ {item.price}</div>
            </div>
            <div className="cart-item-actions">
              <div className="qty-control">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              </div>
              <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                ৳ {item.price * item.quantity}
              </div>
              <button className="cart-remove" onClick={() => removeFromCart(item.productId)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal ({cartCount} items)</span>
          <span className="price">৳ {cartTotal}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Charge</span>
          <span className="price">৳ 100</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span className="price">৳ {cartTotal + 100}</span>
        </div>
        <Link href="/checkout" className="btn-primary btn-lg mt-6" style={{ width: '100%', justifyContent: 'center' }}>
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
