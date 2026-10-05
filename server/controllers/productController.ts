import { Request, Response } from 'express';
import { dataStore } from '../data/store.ts';
import { CATEGORIES } from '../data/seedData.ts';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, sort, inStock } = req.query;

    const products = await dataStore.products.find({
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      sort: typeof sort === 'string' ? sort : undefined,
      inStock: inStock === 'true',
    });

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await dataStore.products.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve product details.' });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      categories: CATEGORIES,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, description, price, discount, stock, image, availability, featured } = req.body;

    if (!name || !category || !description || price === undefined || stock === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory product fields (name, category, description, price, stock, image).',
      });
    }

    const numPrice = Number(price);
    const numStock = Number(stock);
    const numDiscount = Number(discount) || 0;

    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
    }

    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock must be a valid positive number.' });
    }

    const created = await dataStore.products.create({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: numPrice,
      discount: numDiscount,
      stock: numStock,
      image: image.trim(),
      availability: availability !== undefined ? !!availability : numStock > 0,
      featured: !!featured,
    });

    return res.status(201).json({
      success: true,
      message: 'Product successfully added to catalog.',
      product: created,
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create product.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await dataStore.products.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updated = await dataStore.products.update(id, req.body);

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.products.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found or already deleted.' });
    }

    return res.json({
      success: true,
      message: 'Product removed from catalog successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};
