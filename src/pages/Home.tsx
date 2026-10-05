import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, RotateCcw, Search, Sparkles } from 'lucide-react';
import { Product } from '../types/index.ts';
import { productsApi } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentCategory = searchParams.get('category') || 'All Products';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentInStock = searchParams.get('inStock') === 'true';

  // Fetch categories once
  useEffect(() => {
    productsApi.getCategories().then((res) => {
      setCategories(res.categories || []);
    }).catch(() => {
      setCategories(['All Products', 'Electronics', 'Clothing & Apparel', 'Footwear & Leather', 'Home & Living', 'Accessories & Horology', 'Grooming & Fragrance']);
    });
  }, []);

  // Fetch products based on active filters
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await productsApi.getProducts({
        category: currentCategory,
        search: currentSearch,
        sort: currentSort,
        inStock: currentInStock,
      });
      setProducts(res.products || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load catalog products.');
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, currentSearch, currentSort, currentInStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setCategoryFilter = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All Products') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const setSortOption = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    setSearchParams(params);
  };

  const toggleInStock = () => {
    const params = new URLSearchParams(searchParams);
    if (currentInStock) {
      params.delete('inStock');
    } else {
      params.set('inStock', 'true');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory !== 'All Products' || currentSearch || currentSort !== 'newest' || currentInStock;

  return (
    <div className="space-y-12">
      {/* Storefront Editorial Campaign Hero (shown on default landing) */}
      {!currentSearch && currentCategory === 'All Products' && (
        <section className="relative overflow-hidden rounded-xl bg-stone-900 text-stone-100 border border-stone-800 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Copy zone */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-300 tracking-wider uppercase">
                <span>Authentic Workshop Craft</span>
                <span aria-hidden="true">·</span>
                <span>Season 2026 Collection</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-white text-balance leading-[1.15]">
                Curated essentials built for everyday permanence.
              </h1>

              <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed font-normal">
                Discover refined studio acoustics, vegetable-tanned leather travel gear, automatic horology, and minimalist living artifacts. Delivered with flexible Cash on Delivery directly to your doorstep.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-stone-100 text-stone-900 font-semibold text-xs tracking-wide uppercase hover:bg-white transition-colors shadow-sm"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <span className="text-xs text-stone-400">
                  Cash on Delivery & Free Shipping over $150
                </span>
              </div>
            </div>

            {/* Visual Hero asset */}
            <div className="lg:col-span-6 relative aspect-16/9 lg:aspect-auto lg:h-[460px] bg-stone-950 overflow-hidden">
              <img
                src="/src/assets/images/balan_hero_showcase_1791212357603.jpg"
                alt="Balan Curated Lifestyle Goods"
                className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog Viewport Anchor */}
      <section id="catalog" className="space-y-6 pt-2">
        {/* Section Heading & Result Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Curated Catalog
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif tracking-tight">
              {currentSearch
                ? `Results for "${currentSearch}"`
                : currentCategory === 'All Products'
                ? 'All Available Goods'
                : currentCategory}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-mono tabular-nums font-medium text-stone-800">{products.length}</span>
            <span>products available</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 ml-3 text-stone-700 hover:text-stone-950 font-medium underline underline-offset-4"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls & Category Bar */}
        <div className="space-y-3">
          {/* Category Tabs (Segmented interactive controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = (cat === 'All Products' && !searchParams.get('category')) || searchParams.get('category') === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-stone-100 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Sorting and In-Stock Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {/* In-stock toggle */}
              <button
                onClick={toggleInStock}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  currentInStock
                    ? 'border-stone-800 bg-stone-800 text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentInStock ? 'bg-emerald-400' : 'bg-stone-400'}`} />
                <span>In Stock Only</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs text-stone-500 font-medium">Sort By:</label>
              <select
                id="sort-select"
                value={currentSort}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs font-medium bg-white border border-stone-200 rounded-md px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-stone-800"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white border border-stone-200 rounded-lg p-4 space-y-4 animate-pulse">
                <div className="aspect-4/3 bg-stone-200 rounded" />
                <div className="h-3 bg-stone-200 rounded w-1/3" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-full" />
                <div className="pt-2 flex justify-between">
                  <div className="h-5 bg-stone-200 rounded w-16" />
                  <div className="h-7 bg-stone-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-rose-50 border border-rose-200 rounded-xl space-y-3">
            <p className="text-sm font-semibold text-rose-800">{error}</p>
            <button
              onClick={() => fetchProducts()}
              className="text-xs font-medium text-rose-900 underline underline-offset-4"
            >
              Try reloading products
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center bg-white border border-stone-200 rounded-xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <Search className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900 font-serif">No products match your criteria</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                We couldn't find items matching your active category or search terms. Try clearing filters or searching for different keywords.
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md bg-stone-900 text-white hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
