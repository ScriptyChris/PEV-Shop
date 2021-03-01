import { model } from 'mongoose';
import productSchema, { IProduct } from '../schemas/product';

export { IProduct };

export default model<IProduct>('Product', productSchema);
