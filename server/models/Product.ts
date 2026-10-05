import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  image: string;
  stock: number;
  availability: boolean;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate finalPrice
ProductSchema.pre('save', function () {
  if (this.price !== undefined) {
    const discountAmount = (this.price * (this.discount || 0)) / 100;
    this.finalPrice = Math.max(0, Math.round(this.price - discountAmount));
  }
  if (this.stock <= 0) {
    this.availability = false;
  }
});

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
