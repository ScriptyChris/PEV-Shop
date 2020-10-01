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
    } else {
      this._userCartState.products.push(userCartState);
    }
  }

  get userCartProducts() {
    return this._userCartState.products;
  }

  get userCartPriceSum() {
    return this._userCartState.priceSum;
  }
}

decorate(AppStore, {
  _userSessionState: observable,
  updateUserSessionState: action,

  _userCartState: observable,
  updateUserCartState: action,
});

const appStore = new AppStore();

export { USER_SESSION_STATES };

export default appStore;
