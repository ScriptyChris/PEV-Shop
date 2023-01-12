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

export interface IProductInOrder {
  name: string;
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
  }[];
  totalCount: number;
  totalPrice: number;
}

export interface IOrder {
  receiver: {
    baseInfo: {
      name: string;
      email: string;
      phone: string;
    };
    address: string;
  };
  shipmentType: 'inPerson' | 'home' | 'parcelLocker';
  // TODO: [DX] get that from PayU API
  paymentType: 'Cash' | 'Card' | 'Transfer' | 'BLIK';
  products: (IUserCart['products'] & { count: number })[];
  price: {
    shipment: number;
    total: number;
  };
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
