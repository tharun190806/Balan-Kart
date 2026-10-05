import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User as UserIcon, LogOut, PackageCheck, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'All Goods', path: '/' },
    { name: 'Electronics', path: '/?category=Electronics' },
    { name: 'Apparel', path: '/?category=Clothing+%26+Apparel' },
    { name: 'Horology', path: '/?category=Accessories+%26+Horology' },
    { name: 'Leather', path: '/?category=Footwear+%26+Leather' },
    { name: 'Home', path: '/?category=Home+%26+Living' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-stone-200">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-stone-700 hover:text-stone-900 p-1"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-stone-900 font-serif">
            BALAN
          </Link>
        </div>

        {/* Zone 2: 4-6 Clean Text Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-stone-900 hover:underline underline-offset-8 decoration-stone-400 transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Actions & Search & Cart */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search Trigger / Inline Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 md:w-56 pl-8 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-md focus:outline-none focus:border-stone-900 focus:bg-white transition-all text-stone-800 placeholder-stone-400"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400 pointer-events-none" />
          </form>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden text-stone-600 hover:text-stone-900 p-1"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Orders Link (for logged-in customer) */}
          {isAuthenticated && (
            <Link
              to="/my-orders"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:underline underline-offset-4 whitespace-nowrap"
              title="My Orders"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Orders</span>
            </Link>
          )}

          {/* Cart Icon with Tabular Badge */}
          <Link
            to="/cart"
            className="relative p-2 text-stone-800 hover:text-stone-950 transition-colors flex items-center"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-100 text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center font-mono tabular-nums shadow-sm">
                {cart.totalItems}
              </span>
            )}
          </Link>

          {/* Account Area */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
              <Link
                to="/my-orders"
                className="flex items-center gap-1.5 text-xs font-medium text-stone-800 hover:text-stone-950 truncate max-w-[110px]"
                title={user?.name}
              >
                <UserIcon className="w-4 h-4 text-stone-500" />
                <span className="truncate">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="text-stone-500 hover:text-stone-900 p-1 transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
              <Link
                to="/login"
                className="text-xs font-medium text-stone-700 hover:text-stone-950 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 px-3 py-1.5 rounded transition-colors whitespace-nowrap shadow-xs"
              >
                Register
              </Link>
            </div>
          )}

          {/* Admin link shortcut if user is admin or visitor wants to access admin portal */}
          <Link
            to={isAdmin ? '/admin/dashboard' : '/admin/login'}
            className="hidden sm:inline-flex items-center text-[11px] font-medium text-stone-400 hover:text-stone-700 tracking-wider uppercase ml-1"
            title="Administrator Portal"
          >
            Admin
          </Link>
        </div>
      </div>

      {/* Mobile Search Input Drawer */}
      {isSearchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-stone-100 bg-[#FBFBFA]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:border-stone-900"
              autoFocus
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          </form>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-stone-800 py-1.5 hover:text-stone-950 border-b border-stone-50"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-stone-800 py-1.5 hover:text-stone-950 border-b border-stone-50 flex items-center justify-between"
              >
                <span>My Orders</span>
                <PackageCheck className="w-4 h-4 text-stone-400" />
              </Link>
            )}
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-medium text-stone-500 py-2 hover:text-stone-900 flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Module Portal</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
