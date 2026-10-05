import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { adminApi } from '../../services/api.ts';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getCustomers()
      .then((res) => {
        setCustomers(res.customers || []);
      })
      .catch((err) => {
        console.error('Failed to load customers:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Registered Customers
          </h1>
        </div>
        <span className="text-xs font-mono text-stone-500">
          Total: {customers.length} registered customers
        </span>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400 pointer-events-none" />
        </div>
      </div>

      {/* Customer Roster Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-16 text-center space-y-2">
            <span className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin inline-block" />
            <p className="text-xs text-stone-500 font-medium">Retrieving customer profiles...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users className="w-8 h-8 mx-auto text-stone-400 stroke-[1.25]" />
            <p className="text-sm font-semibold text-stone-800">No customers found</p>
            <p className="text-xs text-stone-500">No registered customer records match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-100">
                <tr>
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Email Address</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Registered On</th>
                  <th className="px-5 py-3">Orders Placed</th>
                  <th className="px-5 py-3 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((cust) => {
                  const regDate = cust.createdAt
                    ? new Date(cust.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recent';

                  return (
                    <tr key={cust._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-stone-900">
                        {cust.name}
                      </td>
                      <td className="px-5 py-3.5 text-stone-600 font-mono">
                        {cust.email}
                      </td>
                      <td className="px-5 py-3.5 text-stone-600 font-mono">
                        {cust.phone}
                      </td>
                      <td className="px-5 py-3.5 text-stone-500">
                        {regDate}
                      </td>
                      <td className="px-5 py-3.5 font-mono tabular-nums text-stone-800">
                        <span className="font-semibold">{cust.orderCount || 0}</span> orders
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                        ${cust.totalSpent || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
