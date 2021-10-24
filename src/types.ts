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

export enum HTTP_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NETWORK_AUTH_REQUIRED = 511,
}
