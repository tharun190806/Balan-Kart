import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartData, CartItem } from '../types/index.ts';
import { cartApi } from '../services/api.ts';
import { useToast } from './ToastContext.tsx';

interface CartContextType {
  cart: CartData;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const defaultCart: CartData = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  deliveryCharge: 0,
  totalAmount: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartData>(defaultCart);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await cartApi.getCart();
      setCart(res.cart || defaultCart);
    } catch (err: any) {
      console.warn('Could not sync cart with backend:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    try {
      const res = await cartApi.addItem(productId, quantity);
      setCart(res.cart);
      showToast(res.message || 'Added to shopping bag', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to add item to bag', 'error');
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const res = await cartApi.updateQuantity(productId, quantity);
      setCart(res.cart);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Could not update quantity', 'error');
      return false;
    }
  };

  const removeItem = async (productId: string): Promise<boolean> => {
    try {
      const res = await cartApi.removeItem(productId);
      setCart(res.cart);
      showToast('Item removed from shopping bag', 'info');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Could not remove item', 'error');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartApi.clearCart();
      setCart(res.cart || defaultCart);
    } catch (err: any) {
      console.warn('Could not clear cart:', err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
