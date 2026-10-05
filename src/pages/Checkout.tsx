import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, AlertCircle, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ordersApi } from '../services/api.ts';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

export const Checkout: React.FC = () => {
  const { cart, clearCart, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if user logs in or profile loads
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
      if (!street && user.address?.street) setStreet(user.address.street);
      if (!city && user.address?.city) setCity(user.address.city);
      if (!state && user.address?.state) setState(user.address.state);
      if (!pincode && user.address?.pincode) setPincode(user.address.pincode);
    }
  }, [user]);

  // If cart is empty, redirect to cart page
  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500">Please select goods before proceeding to checkout.</p>
        <Link
          to="/"
          className="inline-block mt-3 px-4 py-2 bg-stone-900 text-stone-100 text-xs font-semibold rounded hover:bg-stone-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please provide complete customer contact information.');
      return;
    }

    if (!street.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setErrorMessage('Please enter your complete physical delivery address.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerDetails: {
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
        },
        deliveryAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        items: cart.items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        notes: notes.trim(),
      };

      const res = await ordersApi.createOrder(orderPayload);

      // Successfully placed
      await clearCart();
      await refreshCart();
      navigate(`/order-success/${res.order.orderId}`, { state: { order: res.order } });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place your Cash on Delivery order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
          Checkout & Doorstep Delivery
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span className="text-xs font-medium text-rose-800">{errorMessage}</span>
        </div>
      )}

      {/* Main Checkout Grid */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Delivery & Customer Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Information Box */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                1. Customer Details
              </h2>
              {!isAuthenticated && (
                <span className="text-xs text-stone-500">
                  Already registered? <Link to="/login" className="text-stone-900 font-medium underline">Sign in</Link>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Wright"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number (For Courier) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 555-019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Box */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
              2. Shipping Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Street Address & Apartment/Suite *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 42 Highfield Terrace, Apt 4B"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    placeholder="NY"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Postal / Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="10001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Delivery Instructions / Landmarks (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ring buzzer 4B or leave with doorman."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-stone-900 text-stone-100 border border-stone-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Payment Method: Cash on Delivery (COD)
              </h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              No online card payment or bank transfer required now. Prepare the exact cash amount (${cart.totalAmount}) or use courier contactless scan upon physical handover.
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation CTA */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs lg:sticky lg:top-24">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
            Order Review
          </h2>

          {/* Items Preview */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-100">
            {cart.items.map((item) => (
              <div key={item.product._id} className="pt-3 first:pt-0 flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    fallbackTitle={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-stone-900 truncate block">
                    {item.product.name}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Qty: {item.quantity} × ${item.product.finalPrice}
                  </span>
                </div>
                <span className="text-xs font-bold font-mono tabular-nums text-stone-900">
                  ${item.product.finalPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal</span>
              <span className="font-mono tabular-nums text-stone-900">${cart.subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Logistics</span>
              <span className="font-mono tabular-nums text-stone-900">
                {cart.deliveryCharge === 0 ? 'Free' : `$${cart.deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>COD Handling Fee</span>
              <span className="text-emerald-700 font-medium">$0 (Free)</span>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-900">Total Payable</span>
              <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
                ${cart.totalAmount}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-100 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 justify-center text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guaranteed zero-risk Cash on Delivery</span>
          </div>
        </div>

      </form>
    </div>
  );
};
