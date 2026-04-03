import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Materiqo - Build Better, Build with Materiqo | Architectural Equipment',
  description: 'Your trusted e-commerce platform for architectural equipment and supplies. Serving RUET students and Rajshahi city with drafting tools, model making supplies, and more.',
  keywords: 'architectural equipment, drafting tools, model making, RUET, Rajshahi, Materiqo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="page-container">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
