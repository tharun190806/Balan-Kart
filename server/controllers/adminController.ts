import { Request, Response } from 'express';
import { dataStore } from '../data/store.ts';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await dataStore.orders.getAdminStats();
    return res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const orders = await dataStore.orders.getAllOrdersForAdmin(typeof status === 'string' ? status : undefined);

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await dataStore.orders.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order status successfully updated to "${status}".`,
      order: updated,
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await dataStore.users.getAllCustomers();

    return res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve customer list.' });
  }
};
