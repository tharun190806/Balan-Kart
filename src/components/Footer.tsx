import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      {/* Trust & Policy Ribbon */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-stone-100 tracking-wider uppercase">Cash on Delivery Available</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Inspect your package upon arrival. Pay seamlessly with cash or local courier QR at your doorstep.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-stone-100 tracking-wider uppercase">Genuine Quality Guaranteed</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Directly sourced materials, strict workshop standards, and meticulous quality audits for every piece.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-stone-100 tracking-wider uppercase">Hassle-Free Returns</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                14-day return window on all unworn items with original workshop packaging intact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="text-lg font-bold tracking-tight text-white font-serif">BALAN</span>
          <p className="text-xs text-stone-400 mt-3 leading-relaxed">
            Curated daily essentials, studio electronics, leather craftsmanship, and minimalist home artifacts designed for everyday permanence.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">Curated Departments</h5>
          <ul className="space-y-2 text-xs text-stone-400">
            <li><Link to="/?category=Electronics" className="hover:text-stone-100 transition-colors">Studio Electronics</Link></li>
            <li><Link to="/?category=Footwear+%26+Leather" className="hover:text-stone-100 transition-colors">Full-Grain Leather Goods</Link></li>
            <li><Link to="/?category=Accessories+%26+Horology" className="hover:text-stone-100 transition-colors">Timepieces & Horology</Link></li>
            <li><Link to="/?category=Clothing+%26+Apparel" className="hover:text-stone-100 transition-colors">Organic Heavyweight Apparel</Link></li>
            <li><Link to="/?category=Home+%26+Living" className="hover:text-stone-100 transition-colors">Architectural Home Objects</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">Customer Support</h5>
          <ul className="space-y-2 text-xs text-stone-400">
            <li><Link to="/my-orders" className="hover:text-stone-100 transition-colors">Track Existing Order</Link></li>
            <li><Link to="/cart" className="hover:text-stone-100 transition-colors">Shopping Bag</Link></li>
            <li><span className="hover:text-stone-100 transition-colors cursor-pointer">Cash on Delivery Guidelines</span></li>
            <li><span className="hover:text-stone-100 transition-colors cursor-pointer">Shipping & Dispatch Schedule</span></li>
            <li><span className="hover:text-stone-100 transition-colors cursor-pointer">Terms of Service & Privacy</span></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">Administration</h5>
          <p className="text-xs text-stone-400 mb-3 leading-relaxed">
            Authorized store operators and inventory managers can access the administrative suite below.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded transition-colors"
          >
            Admin Management Portal &rarr;
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Balan E-Commerce Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Payment: Cash on Delivery (COD)</span>
            <span>Secure TLS Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
