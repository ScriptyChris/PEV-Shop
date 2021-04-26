export type TJestMock<T = void> = jest.Mock<any, T | any>;

export interface IProductInOrder {
    name: number;
    unitPrice: number;
    quantity: number;
}

export interface IPayByLinkMethod {
    type?: 'PBL' | 'PAYMENT_WALL',
    value: string,
    name: string,
    status: 'ENABLED' | 'DISABLED' | 'TEMPORARY_DISABLED',
    minAmount: number,
    maxAmount: number,
}
