export type TJestMock<T = void> = jest.Mock<any, T | any>;

export interface IProductInOrder {
  name: number;
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

export type TPagination = { pageNumber: number; productsPerPage: number };
