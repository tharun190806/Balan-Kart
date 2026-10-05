import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Search, CheckCircle, Clock, Truck, XCircle, MapPin, Banknote } from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.ts';
import { adminApi } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { ImageWithFallback } from '../../components/ImageWithFallback.tsx';

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getOrders(statusFilter);
      setOrders(res.orders || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve orders.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId || o.orderId === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      showToast(`Order status updated to "${newStatus}".`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.orderId.toLowerCase().includes(term) ||
      o.customerDetails.fullName.toLowerCase().includes(term) ||
      o.customerDetails.email.toLowerCase().includes(term) ||
      o.customerDetails.phone.includes(term)
    );
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Fulfillment & Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Customer Orders
          </h1>
        </div>
        <span className="text-xs font-mono text-stone-500">
          Showing {filteredOrders.length} matching orders
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['All', ...STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-stone-900 text-stone-100 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400 pointer-events-none" />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="p-16 text-center space-y-2 bg-white rounded-xl border border-stone-200">
          <span className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin inline-block" />
          <p className="text-xs text-stone-500 font-medium">Loading orders from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-xl border border-stone-200">
          <ShoppingBag className="w-8 h-8 mx-auto text-stone-400 stroke-[1.25]" />
          <p className="text-sm font-semibold text-stone-800">No orders found</p>
          <p className="text-xs text-stone-500">There are currently no customer orders matching the specified filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order._id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs divide-y divide-stone-100"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-stone-50/70 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Order ID</span>
                      <span className="font-mono font-bold text-stone-900 text-sm mt-0.5 block">{order.orderId}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Date & Time</span>
                      <span className="text-stone-700 font-medium mt-0.5 block">{formattedDate}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Customer</span>
                      <span className="text-stone-900 font-semibold mt-0.5 block">
                        {order.customerDetails.fullName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Amount Due</span>
                      <span className="font-mono font-bold text-stone-900 text-sm mt-0.5 block">
                        ${order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Status selector directly interactive */}
                  <div className="flex items-center gap-2">
                    <label htmlFor={`status-${order._id}`} className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Status:
                    </label>
                    <select
                      id={`status-${order._id}`}
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded border focus:outline-none cursor-pointer ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer, Shipping, and Item Breakdown */}
                <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Delivery & Customer Info */}
                  <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-stone-100 pb-4 lg:pb-0 lg:pr-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Customer & Shipping Details
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-900">{order.customerDetails.fullName}</p>
                      <p className="text-stone-600">Email: {order.customerDetails.email}</p>
                      <p className="text-stone-600">Phone: {order.customerDetails.phone}</p>
                    </div>

                    <div className="pt-2 text-stone-700">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                        </span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="p-2 bg-stone-50 rounded border border-stone-100 text-stone-500 italic mt-2">
                        &ldquo;{order.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Items Ordered List */}
                  <div className="lg:col-span-7 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Ordered Products ({order.items.length})
                    </span>
                    <div className="divide-y divide-stone-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                fallbackTitle={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-stone-900 line-clamp-1 block">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-stone-500 font-mono">
                                Qty: {item.quantity} × ${item.price}
                              </span>
                            </div>
                          </div>

                          <span className="font-mono font-bold text-stone-900 tabular-nums">
                            ${item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
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
