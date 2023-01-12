/**
 * @module
 * @notExported
 */

import mongoose from 'mongoose';
// fix `isValidObjectId` lost `this`
export const isValidObjectId = mongoose.isValidObjectId.bind(mongoose);

export { Schema, Document, model, Model, Types, MongooseDocument, ModelPopulateOptions } from 'mongoose';

export const COLLECTION_NAMES = Object.freeze({
  Product: 'Product',
  User: 'User',
  User_Role: 'User_Role',
} as const);
export type TCOLLECTION_NAMES = keyof typeof COLLECTION_NAMES;

// TODO: [feature] add `admin` role
export const USER_ROLES_MAP = Object.freeze({
  client: 'client',
  seller: 'seller',
} as const);
export type TUserRoleName = keyof typeof USER_ROLES_MAP;
