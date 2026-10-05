import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Users,
  ShoppingBag,
  Clock,
  CheckCircle,
  DollarSign,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AdminStats, Order } from '../../types/index.ts';
import { adminApi, systemApi } from '../../services/api.ts';
import { RefreshCw, Database, ShieldAlert, Check } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [reconnectResult, setReconnectResult] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const [statsRes, ordersRes, sysRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getOrders(),
        systemApi.getStatus().catch(() => null),
      ]);
      setStats(statsRes.stats);
      setRecentOrders((ordersRes.orders || []).slice(0, 5));
      setDbStatus(sysRes?.database || null);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleTestConnection = async () => {
    setIsReconnecting(true);
    setReconnectResult(null);
    try {
      const res = await systemApi.reconnectDb();
      setDbStatus(res.database);
      if (res.database?.connected) {
        setReconnectResult('Successfully connected to MongoDB Atlas!');
        await loadDashboard();
      } else {
        setReconnectResult(res.database?.message || 'Connection attempt completed.');
      }
    } catch (err: any) {
      setReconnectResult(`Connection probe error: ${err.message}`);
    } finally {
      setIsReconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <span className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Aggregating platform metrics...</p>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: `$${stats?.totalRevenue || 0}`,
      icon: DollarSign,
      desc: 'Gross orders processed',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      desc: 'All recorded customer orders',
      color: 'text-stone-800 bg-stone-100 border-stone-200',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      desc: 'Awaiting dispatch/confirmation',
      color: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      label: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle,
      desc: 'Fulfilled & cash collected',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Catalog Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      desc: 'Active inventory items',
      color: 'text-blue-800 bg-blue-50 border-blue-200',
    },
    {
      label: 'Registered Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      desc: 'Customer accounts',
      color: 'text-purple-800 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with DB Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Administrative Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Dashboard Overview
          </h1>
        </div>

        {/* Database state indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            disabled={isReconnecting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-100 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
            <span>{isReconnecting ? 'Testing Atlas...' : 'Test / Reconnect Atlas'}</span>
          </button>
        </div>
      </div>

      {/* Database Diagnostic & Whitelist Card */}
      {dbStatus && (
        <div
          className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
            dbStatus.connected
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-stone-50 border-stone-300 text-stone-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="font-bold uppercase tracking-wider text-[11px]">
                {dbStatus.connected
                  ? 'MongoDB Atlas: Connected & Active'
                  : 'Database State: Resilient Local Storage Active'}
              </span>
              {dbStatus.clusterHost && (
                <span className="font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200 text-[10px]">
                  {dbStatus.clusterHost}
                </span>
              )}
            </div>

            <span className="text-[11px] text-stone-500 font-medium">
              {dbStatus.connected
                ? 'All operations syncing with live MongoDB Atlas cloud'
                : '100% operational in local storage mode'}
            </span>
          </div>

          <p className="leading-relaxed text-stone-600">
            {dbStatus.message}
          </p>

          {!dbStatus.connected && dbStatus.uriConfigured && (
            <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1.5 text-stone-700">
              <span className="font-semibold block text-stone-900">
                To connect directly to your MongoDB Atlas cluster:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-600">
                <li>
                  Open <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-stone-900 underline font-medium">cloud.mongodb.com</a> and navigate to <strong>Security &rarr; Network Access</strong>.
                </li>
                <li>
                  Click <strong>+ Add IP Address</strong> and choose <strong>Allow Access from Anywhere</strong> (<code className="bg-stone-100 px-1 py-0.5 rounded">0.0.0.0/0</code>).
                </li>
                <li>
                  Click <strong>Confirm</strong>, wait ~1 minute for Atlas to apply, then click the <strong>&ldquo;Test / Reconnect Atlas&rdquo;</strong> button above!
                </li>
              </ol>
            </div>
          )}

          {reconnectResult && (
            <div className="p-2.5 bg-stone-900 text-stone-100 rounded text-[11px] font-mono">
              &gt; {reconnectResult}
            </div>
          )}
        </div>
      )}

      {/* 6 Core Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs hover:border-stone-400 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block">
                    {kpi.label}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums mt-1 block">
                    {kpi.value}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border ${kpi.color}`}>
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
              </div>
              <span className="text-[11px] text-stone-400 mt-4 block border-t border-stone-50 pt-2">
                {kpi.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/products/add"
          className="p-4 bg-stone-900 text-stone-100 rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-between shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs font-bold block uppercase tracking-wider">Add Product</span>
              <span className="text-[11px] text-stone-400">Expand store catalog</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/products"
          className="p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 transition-colors flex items-center justify-between shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-stone-700" />
            <div>
              <span className="text-xs font-bold text-stone-900 block uppercase tracking-wider">
                Manage Catalog
              </span>
              <span className="text-[11px] text-stone-500">Update stock & pricing</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/orders"
          className="p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 transition-colors flex items-center justify-between shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-stone-700" />
            <div>
              <span className="text-xs font-bold text-stone-900 block uppercase tracking-wider">
                Dispatch Orders
              </span>
              <span className="text-[11px] text-stone-500">Update COD statuses</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/customers"
          className="p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 transition-colors flex items-center justify-between shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-stone-700" />
            <div>
              <span className="text-xs font-bold text-stone-900 block uppercase tracking-wider">
                Customer Roster
              </span>
              <span className="text-[11px] text-stone-500">Registered shoppers</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-serif text-stone-900">Recent Customer Orders</h2>
            <p className="text-xs text-stone-500 mt-0.5">Most recent orders placed across all categories</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-stone-800 hover:text-stone-950 underline underline-offset-4"
          >
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-100">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-medium text-stone-900">
                    {ord.orderId}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-stone-900 block">{ord.customerDetails.fullName}</span>
                    <span className="text-[11px] text-stone-500">{ord.customerDetails.email}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono tabular-nums text-stone-600">
                    {ord.items.length} items
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-stone-900 tabular-nums">
                    ${ord.totalAmount}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ord.orderStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-stone-700 hover:text-stone-950 font-medium underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
