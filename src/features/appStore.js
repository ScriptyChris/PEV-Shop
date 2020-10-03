import { observable, decorate, action } from 'mobx';

const USER_SESSION_STATES = Object.freeze({
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
});

const USER_CART_STATE = {
  priceSum: 0,
  products: [],
};

class AppStore {
  constructor() {
    this._userSessionState = USER_SESSION_STATES.LOGGED_OUT;
    this._userCartState = USER_CART_STATE;
  }

  updateUserSessionState(userSessionState) {
    this._userSessionState = userSessionState;
  }

  getUserSessionState() {
    return this._userSessionState;
  }

  updateUserCartState(userCartState) {
    // TODO: improve converting price to number
    this._userCartState.priceSum += Number(userCartState.price.replace(/\D/g, ''));

    const productIndexInCart = this._userCartState.products.findIndex(
      (productItem) => productItem.name === userCartState.name
    );
    if (productIndexInCart !== -1) {
      this._userCartState.products[productIndexInCart].count++;
      this._userCartState.totalCount++;
    } else {
      userCartState.count = 1;
      this._userCartState.products.push(userCartState);
      this._userCartState.totalCount = 'totalCount' in this._userCartState ? this._userCartState.totalCount + 1 : 1;
    }
  }

  clearUserCartState() {
    this._userCartState.products.splice(0, this._userCartState.products.length);

    this._userCartState.priceSum = 0;
    this._userCartState.totalCount = 0;
  }

  get userCartProducts() {
    return this._userCartState.products;
  }

  get userCartPriceSum() {
    return this._userCartState.priceSum;
  }

  get userCartProductsCount() {
    return this._userCartState.totalCount;
  }
}

decorate(AppStore, {
  _userSessionState: observable,
  updateUserSessionState: action,

  _userCartState: observable,
  updateUserCartState: action,
  clearUserCartState: action,
});

const appStore = new AppStore();

export { USER_SESSION_STATES };

export default appStore;
