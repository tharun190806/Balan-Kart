import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { dataStore } from '../data/store.ts';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { customerDetails, deliveryAddress, items, notes } = req.body;
    const userId = req.user ? req.user._id.toString() : undefined;

    // Validate customer details
    if (!customerDetails?.fullName || !customerDetails?.email || !customerDetails?.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all customer contact fields (Full Name, Email, Phone).',
      });
    }

    // Validate delivery address
    if (
      !deliveryAddress?.street ||
      !deliveryAddress?.city ||
      !deliveryAddress?.state ||
      !deliveryAddress?.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete full delivery address (Street, City, State, Pincode).',
      });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty. Please add products before placing an order.',
      });
    }

    const order = await dataStore.orders.create({
      userId,
      customerDetails: {
        fullName: customerDetails.fullName.trim(),
        email: customerDetails.email.toLowerCase().trim(),
        phone: customerDetails.phone.trim(),
      },
      deliveryAddress: {
        street: deliveryAddress.street.trim(),
        city: deliveryAddress.city.trim(),
        state: deliveryAddress.state.trim(),
        pincode: deliveryAddress.pincode.trim(),
      },
      items: items.map((i: any) => ({
        product: i.product?._id || i.product || i.productId,
        quantity: Number(i.quantity) || 1,
      })),
      notes: notes?.trim() || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully.',
      order,
    });
  } catch (error: any) {
    console.error('Order placement error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to place order.',
    });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to view orders.' });
    }

    const orders = await dataStore.orders.getUserOrders(req.user._id.toString());

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await dataStore.orders.getOrderByIdOrCode(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // If user is not admin and order belongs to another registered user, deny
    if (req.user && req.user.role !== 'admin' && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this order.' });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve order.' });
  }
};
