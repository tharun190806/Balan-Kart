import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, Clock, Banknote, MapPin } from 'lucide-react';
import { Order } from '../types/index.ts';
import { ordersApi } from '../services/api.ts';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      setIsLoading(true);
      ordersApi
        .getOrderById(orderId)
        .then((res) => {
          setOrder(res.order);
        })
        .catch((err) => {
          console.error('Failed to load order:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [order, orderId]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <span className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Retrieving order confirmation details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-8 h-8 stroke-[1.75]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
          Your order has been placed successfully.
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Thank you for choosing Balan. Our fulfillment team is packaging your items. Payment will be collected in cash upon arrival.
        </p>
      </div>

      {/* Main Order Card */}
      {order && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs divide-y divide-stone-100">
          {/* Key metadata line */}
          <div className="p-6 bg-stone-50/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">Order ID</span>
              <span className="font-mono font-bold text-stone-900 text-sm mt-0.5 block">{order.orderId}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">Order Status</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                {order.orderStatus}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">Payment Mode</span>
              <span className="font-medium text-stone-800 mt-0.5 block flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-stone-500" />
                <span>{order.paymentMethod}</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">Total Amount</span>
              <span className="font-mono font-bold text-stone-900 text-sm mt-0.5 block">${order.totalAmount}</span>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="p-6 space-y-2 text-xs">
            <h3 className="font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Delivery Destination</span>
            </h3>
            <p className="text-stone-700 leading-relaxed font-medium">
              {order.customerDetails.fullName} — {order.customerDetails.phone}
            </p>
            <p className="text-stone-500 leading-relaxed">
              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
            </p>
            {order.notes && (
              <p className="text-stone-500 italic mt-1">Instructions: &ldquo;{order.notes}&rdquo;</p>
            )}
          </div>

          {/* Itemized Goods */}
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Ordered Artifacts ({order.items.length})
            </h3>
            <div className="divide-y divide-stone-100">
              {order.items.map((item, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-stone-900 line-clamp-1 block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        Qty: {item.quantity} × ${item.price}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono tabular-nums text-stone-900">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to="/my-orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-stone-900 text-stone-100 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors shadow-xs"
        >
          <span>View My Orders</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};
