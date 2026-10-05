import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { Product } from '../types/index.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setIsAdding(true);
    const success = await addToCart(product._id, 1);
    setIsAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const isOutOfStock = product.stock <= 0 || !product.availability;

  return (
    <div className="group relative flex flex-col bg-white border border-stone-200/80 rounded-lg overflow-hidden hover:border-stone-400 transition-all duration-200 hover:-translate-y-0.5">
      {/* Product Image Slot */}
      <Link to={`/products/${product._id}`} className="relative aspect-4/3 w-full bg-stone-100 block overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          fallbackTitle={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Discount Indicator - subtle editorial text */}
        {product.discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-stone-900/90 text-stone-100 text-[11px] font-medium px-2 py-0.5 rounded tracking-wide">
            -{product.discount}%
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 text-stone-900 text-xs font-semibold px-3 py-1 rounded shadow-xs tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium uppercase tracking-wider mb-1.5">
            <span>{product.category}</span>
            {product.stock > 0 && product.stock <= 5 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-normal">Only {product.stock} left</span>
              </>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/products/${product._id}`}
            className="block text-sm font-semibold text-stone-900 hover:text-stone-700 line-clamp-1 transition-colors"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
              ${product.finalPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                ${product.price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/products/${product._id}`}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 px-2 py-1 transition-colors"
            >
              Details
            </Link>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || isAdding}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${
                justAdded
                  ? 'bg-emerald-800 text-white'
                  : isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-stone-100 hover:bg-stone-800'
              }`}
              title={isOutOfStock ? 'Currently out of stock' : 'Add to shopping bag'}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : isAdding ? (
                <span className="w-3.5 h-3.5 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
