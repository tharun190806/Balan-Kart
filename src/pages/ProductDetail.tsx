import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  CheckCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  Star,
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { productsApi } from '../services/api.ts';
import { useCart } from '../context/CartContext.tsx';
import { ImageWithFallback } from '../components/ImageWithFallback.tsx';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'authenticity'>('details');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    productsApi
      .getProductById(id)
      .then((res) => {
        setProduct(res.product);
      })
      .catch((err) => {
        setError(err.message || 'Product not found.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <span className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Loading product specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-8 bg-stone-100 rounded-xl border border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 font-serif">Product Not Found</h2>
          <p className="text-xs text-stone-500 mt-2">
            The requested product is unavailable, out of stock, or has been archived.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 text-xs font-semibold bg-stone-900 text-stone-100 rounded hover:bg-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0 || !product.availability;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stock) return product.stock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    await addToCart(product._id, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    await addToCart(product._id, quantity);
    navigate('/checkout');
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-stone-900 transition-colors">Catalog</Link>
        <span>/</span>
        <Link
          to={`/?category=${encodeURIComponent(product.category)}`}
          className="hover:text-stone-900 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Contiguous Purchase Module (PDP Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Gallery & Visual Asset */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/3 sm:aspect-16/10 w-full rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              fallbackTitle={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Micro badges below image */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white border border-stone-200/80 rounded-md text-center">
              <Truck className="w-4 h-4 mx-auto text-stone-600 mb-1" />
              <span className="text-[11px] font-medium text-stone-700 block">Cash on Delivery</span>
              <span className="text-[10px] text-stone-400 block">Pay at Doorstep</span>
            </div>
            <div className="p-3 bg-white border border-stone-200/80 rounded-md text-center">
              <ShieldCheck className="w-4 h-4 mx-auto text-stone-600 mb-1" />
              <span className="text-[11px] font-medium text-stone-700 block">Authentic Piece</span>
              <span className="text-[10px] text-stone-400 block">Quality Verified</span>
            </div>
            <div className="p-3 bg-white border border-stone-200/80 rounded-md text-center">
              <RefreshCw className="w-4 h-4 mx-auto text-stone-600 mb-1" />
              <span className="text-[11px] font-medium text-stone-700 block">14-Day Returns</span>
              <span className="text-[10px] text-stone-400 block">Risk-Free Trial</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Contiguous Purchase Box */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Category & Status Line */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium uppercase tracking-wider mb-2">
                <span>{product.category}</span>
                <span className={`font-mono ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Review rating indicator */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-stone-600 font-mono font-medium">{product.rating || 4.8}</span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500">{product.reviewsCount || 42} reviews</span>
              </div>
            </div>

            {/* Price Module */}
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/60 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-medium text-stone-500 block uppercase tracking-wider mb-0.5">
                  Order Total
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                    ${product.finalPrice}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm font-mono tabular-nums text-stone-400 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>

              {product.discount > 0 && (
                <span className="bg-stone-900 text-stone-100 text-xs font-semibold px-2.5 py-1 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Description Preview */}
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Stepper & Stock Boundary Check */}
            {!isOutOfStock && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="pdp-qty" className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Quantity
                  </label>
                  <span className="text-xs text-stone-400">Max: {product.stock}</span>
                </div>

                <div className="inline-flex items-center border border-stone-200 rounded-md bg-stone-50">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span id="pdp-qty" className="w-12 text-center text-xs font-bold font-mono tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 text-stone-100 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
              >
                {isAdding ? (
                  <span className="w-4 h-4 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-stone-800 text-stone-900 hover:bg-stone-50 disabled:border-stone-200 disabled:text-stone-400 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Cash on Delivery)</span>
              </button>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="pt-2 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-500">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Eligible for <strong>Cash on Delivery</strong> payment. Inspect your items upon arrival before handing payment to the courier.
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Secondary Product Details, Shipping & Specifications Tabs */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 mt-12 space-y-6">
        <div className="flex items-center gap-6 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Product Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'shipping'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Shipping & COD Terms
          </button>
          <button
            onClick={() => setActiveTab('authenticity')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'authenticity'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Workshop & Craft Standards
          </button>
        </div>

        <div className="text-xs text-stone-600 leading-relaxed max-w-3xl">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <p>
                Each {product.name} undergoes individual bench calibration and dimensional inspection prior to boxing. Sourced responsibly and built to endure frequent daily handling without cosmetic degradation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 rounded border border-stone-200/60">
                  <span className="font-semibold text-stone-800 block mb-0.5">Category Designation</span>
                  <span>{product.category}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded border border-stone-200/60">
                  <span className="font-semibold text-stone-800 block mb-0.5">Stock Allocation</span>
                  <span>{product.stock} units currently on shelf</span>
                </div>
                <div className="p-3 bg-stone-50 rounded border border-stone-200/60">
                  <span className="font-semibold text-stone-800 block mb-0.5">Model Identifier</span>
                  <span className="font-mono">{product._id}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded border border-stone-200/60">
                  <span className="font-semibold text-stone-800 block mb-0.5">Workshop Verification</span>
                  <span>100% Quality Audited</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <p>
                <strong>Cash on Delivery (COD) Processing:</strong> Our courier partners deliver orders with signature verification. You have the right to check the seal and exterior condition before handing over the exact cash amount.
              </p>
              <p>
                <strong>Dispatch Timeline:</strong> In-stock items ordered on business days are dispatched within 24–48 hours. Estimated domestic delivery duration is 3–5 working days depending on postal zone.
              </p>
              <p>
                <strong>Shipping Fees:</strong> Free shipping is automatically applied to all orders with total amount exceeding $150. A flat $15 logistics fee is charged for smaller orders.
              </p>
            </div>
          )}

          {activeTab === 'authenticity' && (
            <div className="space-y-3">
              <p>
                Balan maintains direct relationships with artisans, foundries, and boutique electronics workshops. We do not engage in third-party grey market dropshipping.
              </p>
              <p>
                Every piece is protected by our standard 1-year functional workshop warranty against material defects or unexpected mechanical failure.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
