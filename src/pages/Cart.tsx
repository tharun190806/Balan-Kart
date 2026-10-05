import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, Plus, Minus, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  if (isLoading && cart.items.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <span className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Syncing shopping bag...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-serif text-stone-900">Your shopping bag is empty</h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Explore our curated catalog of studio electronics, full-grain leather goods, automatic watches, and home essentials.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-stone-100 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Review Selection</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">Shopping Bag</h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-stone-500 font-mono tabular-nums">{cart.totalItems} items selected</span>
          <button
            onClick={() => clearCart()}
            className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Clear Entire Bag
          </button>
        </div>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-stone-100 rounded-lg border border-stone-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-stone-700" />
            <span className="font-medium text-stone-800">
              {amountToFreeShipping === 0
                ? 'Free Doorstep Shipping unlocked!'
                : `Add $${amountToFreeShipping} more to qualify for Free Shipping`}
            </span>
          </div>
          <span className="font-mono text-stone-500">{freeShippingPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-stone-900 transition-all duration-300"
            style={{ width: `${freeShippingPercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Items Table / List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Itemized List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
            {cart.items.map((item) => {
              const product = item.product;
              const maxStock = product.stock || 1;
              const itemTotal = product.finalPrice * item.quantity;

              return (
                <div key={product._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link
                      to={`/products/${product._id}`}
                      className="w-20 h-20 rounded-md bg-stone-100 overflow-hidden shrink-0 border border-stone-200"
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400 block">
                        {product.category}
                      </span>
                      <Link
                        to={`/products/${product._id}`}
                        className="text-sm font-semibold text-stone-900 hover:text-stone-700 line-clamp-1 block"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-mono font-medium text-stone-800 tabular-nums">
                          ${product.finalPrice} each
                        </span>
                        {product.discount > 0 && (
                          <span className="text-[11px] font-mono text-stone-400 line-through tabular-nums">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      {product.stock <= 5 && (
                        <span className="text-[10px] text-amber-700 mt-1 block">
                          Only {product.stock} left in stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price Column */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-50">
                    {/* Stepper */}
                    <div className="inline-flex items-center border border-stone-200 rounded-md bg-stone-50">
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold font-mono tabular-nums text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total for this line */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-bold font-mono tabular-nums text-stone-900">
                        ${itemTotal}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeItem(product._id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove product"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Checkout Box */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-xs lg:sticky lg:top-24">
          <h2 className="text-base font-bold font-serif text-stone-900 border-b border-stone-100 pb-3">
            Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Bag Subtotal ({cart.totalItems} items)</span>
              <span className="font-mono tabular-nums text-stone-900 font-medium">
                ${cart.subtotal}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <div className="flex items-center gap-1">
                <span>Doorstep Delivery</span>
                {cart.deliveryCharge === 0 && (
                  <span className="text-[10px] text-emerald-700 font-medium">(Free)</span>
                )}
              </div>
              <span className="font-mono tabular-nums text-stone-900 font-medium">
                {cart.deliveryCharge === 0 ? '$0' : `$${cart.deliveryCharge}`}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Payment Processing</span>
              <span className="text-stone-900 font-medium">Cash on Delivery</span>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-900">Total Due on Arrival</span>
              <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
                ${cart.totalAmount}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-stone-500 text-center leading-relaxed">
              No online card input required. You will confirm your physical address and pay upon delivery.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
