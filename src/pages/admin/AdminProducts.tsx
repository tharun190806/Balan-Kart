import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../../types/index.ts';
import { productsApi } from '../../services/api.ts';
import { ImageWithFallback } from '../../components/ImageWithFallback.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await productsApi.getProducts({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm,
      });
      setProducts(res.products || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load catalog.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchTerm, showToast]);

  useEffect(() => {
    productsApi.getCategories().then((res) => {
      setCategories(['All', ...res.categories.filter((c) => c !== 'All Products')]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the database?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await productsApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast(`"${name}" removed from catalog.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuickStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      await productsApi.updateProduct(product._id, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, stock: newStock, availability: newStock > 0 }
            : p
        )
      );
      showToast(`Stock for ${product.name} updated to ${newStock}.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Could not update stock.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Inventory & Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Manage Products
          </h1>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-100 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400 pointer-events-none" />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-medium text-stone-500 whitespace-nowrap">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-md px-3 py-1.5 text-stone-800 focus:bg-white focus:outline-none focus:border-stone-900 w-full sm:w-auto"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center space-y-2">
            <span className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin inline-block" />
            <p className="text-xs text-stone-500">Querying product records...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-8 h-8 mx-auto text-stone-400 stroke-[1.25]" />
            <p className="text-sm font-semibold text-stone-800">No products found</p>
            <p className="text-xs text-stone-500">Try adjusting your search criteria or add a new piece to the catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-100">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock Units</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => {
                  return (
                    <tr key={p._id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Product image & name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            <ImageWithFallback
                              src={p.image}
                              alt={p.name}
                              fallbackTitle={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <span className="font-semibold text-stone-900 line-clamp-1 block">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono">
                              ID: {p._id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-stone-600 font-medium">
                        {p.category}
                      </td>

                      <td className="px-5 py-3.5 font-mono tabular-nums">
                        <span className="font-bold text-stone-900">${p.finalPrice}</span>
                        {p.discount > 0 && (
                          <span className="text-[10px] text-stone-400 block line-through">
                            ${p.price} (-{p.discount}%)
                          </span>
                        )}
                      </td>

                      {/* Stock Quick Stepper */}
                      <td className="px-5 py-3.5">
                        <div className="inline-flex items-center border border-stone-200 rounded bg-stone-50">
                          <button
                            onClick={() => handleQuickStock(p, -1)}
                            className="px-2 py-0.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-stone-900 tabular-nums">
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStock(p, 1)}
                            className="px-2 py-0.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                            p.stock > 0 && p.availability
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {p.stock > 0 && p.availability ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="inline-flex items-center gap-1 p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          disabled={deletingId === p._id}
                          className="inline-flex items-center gap-1 p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
