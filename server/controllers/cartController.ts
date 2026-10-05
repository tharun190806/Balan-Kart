import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { dataStore } from '../data/store.ts';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user._id.toString() : 'guest_cart';
    const cart = await dataStore.cart.getByUser(userId);

    return res.json({
      success: true,
      cart,
    });
  } catch (error: any) {
    console.error('Error getting cart:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve cart items.' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user ? req.user._id.toString() : 'guest_cart';

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const qty = Number(quantity) || 1;
    const updatedCart = await dataStore.cart.addItem(userId, productId, qty);

    return res.json({
      success: true,
      message: 'Item added to shopping bag.',
      cart: updatedCart,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Could not add item to cart.' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user ? req.user._id.toString() : 'guest_cart';

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required.' });
    }

    const qty = Number(quantity);
    const updatedCart = await dataStore.cart.updateQuantity(userId, productId, qty);

    return res.json({
      success: true,
      message: 'Shopping bag updated.',
      cart: updatedCart,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Could not update cart quantity.' });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user ? req.user._id.toString() : 'guest_cart';

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const updatedCart = await dataStore.cart.removeItem(userId, productId);

    return res.json({
      success: true,
      message: 'Item removed from bag.',
      cart: updatedCart,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Could not remove item.' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user._id.toString() : 'guest_cart';
    const emptyCart = await dataStore.cart.clear(userId);

    return res.json({
      success: true,
      message: 'Shopping bag cleared.',
      cart: emptyCart,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Could not clear cart.' });
  }
};
