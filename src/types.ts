export type TJestMock<T = void> = jest.Mock<any, T | any>;

export interface IProductInOrder {
    name: number;
    unitPrice: number;
    quantity: number;
}
