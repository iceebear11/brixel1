import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3><span>Materiqo</span></h3>
            <p>
              Your trusted partner for architectural equipment and supplies.
              Serving RUET students and Rajshahi city with quality tools for
              drafting, model making, and more. Build Better, Build with Materiqo.
            </p>
            <p>📞 01840150075</p>
            <p>✉️ screwedone7@gmail.com</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/products?category=drafting-tools">Drafting Tools</Link></li>
              <li><Link href="/products?category=model-making">Model Making</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><Link href="/cart">Shopping Cart</Link></li>
              <li><Link href="/account/orders">Track Order</Link></li>
              <li><Link href="/login">My Account</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Delivery Areas</h4>
            <ul>
              <li><a>RUET Campus</a></li>
              <li><a>Shaheb Bazar</a></li>
              <li><a>Padma Residential</a></li>
              <li><a>Kazla, Binodpur</a></li>
              <li><a>+ More in Rajshahi</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Materiqo. All rights reserved. | Delivery within 2 days in Rajshahi City 🚚</p>
        </div>
      </div>
    </footer>
  );
}
