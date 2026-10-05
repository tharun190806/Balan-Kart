import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Image } from 'lucide-react';
import { productsApi } from '../../services/api.ts';
import { ImageWithFallback } from '../../components/ImageWithFallback.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(100);
  const [discount, setDiscount] = useState<number | string>(0);
  const [stock, setStock] = useState<number | string>(10);
  const [image, setImage] = useState('');
  const [availability, setAvailability] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    productsApi.getCategories().then((res) => {
      const cats = res.categories.filter((c) => c !== 'All Products');
      setCategories(cats);
      if (!isEditing && cats.length > 0) {
        setCategory(cats[0]);
      }
    }).catch(() => {
      setCategories([
        'Electronics',
        'Clothing & Apparel',
        'Footwear & Leather',
        'Home & Living',
        'Accessories & Horology',
        'Grooming & Fragrance',
      ]);
    });
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      productsApi
        .getProductById(id)
        .then((res) => {
          const p = res.product;
          setName(p.name);
          setCategory(p.category);
          setDescription(p.description);
          setPrice(p.price);
          setDiscount(p.discount || 0);
          setStock(p.stock);
          setImage(p.image);
          setAvailability(p.availability);
          setFeatured(!!p.featured);
        })
        .catch((err) => {
          setErrorMessage(err.message || 'Failed to load existing product record.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isEditing, id]);

  const numPrice = Number(price) || 0;
  const numDiscount = Number(discount) || 0;
  const computedFinalPrice = Math.max(0, Math.round(numPrice - (numPrice * numDiscount) / 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !category.trim() || !description.trim() || !image.trim()) {
      setErrorMessage('Please fill in all mandatory product information.');
      return;
    }

    if (numPrice < 0 || Number(stock) < 0) {
      setErrorMessage('Price and stock cannot be negative values.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: numPrice,
        discount: numDiscount,
        stock: Number(stock),
        image: image.trim(),
        availability: Number(stock) > 0 && availability,
        featured,
      };

      if (isEditing && id) {
        await productsApi.updateProduct(id, payload);
        showToast(`Product "${name}" updated successfully.`, 'success');
      } else {
        await productsApi.createProduct(payload);
        showToast(`Product "${name}" added to catalog.`, 'success');
      }

      navigate('/admin/products');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product to database.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <span className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Loading product schema & data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            {isEditing ? `Edit Product: ${name || 'Item'}` : 'Add New Product to Catalog'}
          </h1>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span className="text-xs font-medium text-rose-800">{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form inputs */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Balan Precision Acoustic Monitor"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Stock Quantity (Units) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Base Price ($) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Final Calculated Price
              </label>
              <div className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-md text-xs font-mono font-bold text-stone-900">
                ${computedFinalPrice}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Image URL / Path *
            </label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="e.g. /src/assets/images/product_studio_headphones_1791212374711.jpg"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900 font-mono"
            />
            <span className="text-[11px] text-stone-400 mt-1 block">
              Provide relative asset path or image URL. The zero-broken-image policy protects against network dropouts.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, origin, dimensions, and craft details..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900 leading-relaxed"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-0"
              />
              <span className="text-xs font-medium text-stone-800">Available for Order</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-0"
              />
              <span className="text-xs font-medium text-stone-800">Featured in Hero Campaign</span>
            </label>
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-8">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block border-b border-stone-100 pb-2">
              Live Card Preview
            </span>

            <div className="aspect-4/3 w-full rounded bg-stone-100 overflow-hidden border border-stone-200">
              <ImageWithFallback
                src={image}
                alt={name}
                fallbackTitle={name || 'Preview Product'}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400 block">
                {category}
              </span>
              <h4 className="text-sm font-bold text-stone-900 line-clamp-1 mt-0.5">
                {name || 'Product Title'}
              </h4>
              <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                {description || 'Product description will appear here as formatted text.'}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-bold font-mono text-stone-900 tabular-nums">
                  ${computedFinalPrice}
                </span>
                {numDiscount > 0 && (
                  <span className="text-xs text-stone-400 line-through font-mono">
                    ${numPrice}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-100 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
