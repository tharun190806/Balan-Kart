import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, ArrowRight, Clock, MapPin, Banknote, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';
import { ordersApi } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

export const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    ordersApi
      .getUserOrders()
      .then((res) => {
        setOrders(res.orders || []);
      })
      .catch((err) => {
        setError(err.message || 'Could not load your orders.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <span className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Loading your purchase history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Account History</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            My Orders
          </h1>
        </div>
        <span className="text-xs font-mono text-stone-500">
          Logged in as {user?.email}
        </span>
      </div>

      {error ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl space-y-3">
          <p className="text-xs font-medium text-rose-800">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white border border-stone-200 rounded-xl p-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <PackageCheck className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="text-base font-semibold text-stone-900 font-serif">No previous orders found</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            You haven&apos;t placed any orders yet. Discover our curated collections and place your first order with flexible Cash on Delivery.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-stone-900 text-stone-100 text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-800"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={order._id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs divide-y divide-stone-100"
              >
                {/* Header Strip */}
                <div className="p-4 sm:p-6 bg-stone-50/60 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">
                        Order Number
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-sm mt-0.5 block">
                        {order.orderId}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">
                        Date Placed
                      </span>
                      <span className="font-medium text-stone-700 mt-0.5 block">
                        {formattedDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium block">
                        Total Payable
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-sm mt-0.5 block">
                        ${order.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="divide-y divide-stone-100">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              fallbackTitle={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-stone-900 line-clamp-1 block">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono">
                              Quantity: {item.quantity} · Unit Price: ${item.price}
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

                {/* Shipping info bottom bar */}
                <div className="p-4 sm:px-6 bg-stone-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      Delivery: {order.deliveryAddress.street}, {order.deliveryAddress.city} {order.deliveryAddress.pincode}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-medium text-stone-700">
                    <Banknote className="w-3.5 h-3.5 text-stone-500" />
                    <span>Payment: {order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
