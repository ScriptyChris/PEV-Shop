/**
 * Common types for whole app.
 * @module
 */

/**
 * @ignore
 */
import userSessionService from '@frontend/features/userSessionService';
/**
 * @ignore
 */
import storageService from '@frontend/features/storageService';
/**
 * @ignore
 */
import storeService from '@frontend/features/storeService';
/**
 * @ignore
 */
import type { Schema } from '@database/models/__core-and-commons';
/**
 * @ignore
 */
import { PAYMENT_METHODS, SHIPMENT_METHODS } from '@commons/consts';

export interface IProductInOrder {
  id: Schema.Types.ObjectId;
  unitPrice: number;
  quantity: number;
}

export interface IPayByLinkMethod {
  type?: 'PBL' | 'PAYMENT_WALL';
  value: string;
  name: string;
  status: 'ENABLED' | 'DISABLED' | 'TEMPORARY_DISABLED';
  minAmount: number;
  maxAmount: number;
}

// remember to update `middleware-response-wrapper.ts` accordingly
// TODO: [REFACTOR] automate synchronization
export enum HTTP_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  // TODO: update `middleware-response-wrapper.ts` accordingly
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  NETWORK_AUTH_REQUIRED = 511,
}

export interface IUserCart {
  products: {
    name: string;
    price: number;
    _id: string;
    quantity: number;
    availability: number;
  }[];
  totalCount: number;
  totalPrice: number;
}

export interface IOrderPayload {
  receiver: {
    name: string;
    email: string;
    phone: string;
  };
  payment: {
    method: typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
  };
  shipment: {
    method: typeof SHIPMENT_METHODS[keyof typeof SHIPMENT_METHODS];
    address: string;
  };
  products: Omit<IProductInOrder, 'unitPrice'>[];
}

export type TPagination = { pageNumber: number; productsPerPage: number };

/**
 * @ignore
 */
export type TE2E = {
  /** @ignore */
  userSessionService: typeof userSessionService;
  /** @ignore */
  storeService: typeof storeService;
  /** @ignore */
  storageService: typeof storageService;
};

/**
 * @ignore
 */
export type TE2EUser = {
  login: string;
  password: string;
  email: string;
  accountType?: string;
  isConfirmed?: boolean;
};

export type TAppSetup = {
  emailServicePort: number;
  previousAppResetTimestamp: number;
  remainingTimestampToNextAppReset: number;
};
