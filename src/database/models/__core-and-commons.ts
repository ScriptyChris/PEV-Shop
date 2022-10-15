export { Schema, Document, model, Model, Types, MongooseDocument } from 'mongoose';

export const COLLECTION_NAMES = {
  Product: 'Product',
  User: 'User',
  User_Role: 'User_Role',
} as const;
export type TCOLLECTION_NAMES = keyof typeof COLLECTION_NAMES;

// TODO: [feature] add `admin` role
export const ROLE_NAMES = ['client', 'seller'] as const;
export type TRoleName = typeof ROLE_NAMES[number];
