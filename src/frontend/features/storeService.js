import { observable, decorate, action } from 'mobx';

const USER_CART_STATE = Object.freeze({
  totalPrice: 0,
  totalCount: 0,
  products: [],
});

const INITIAL_USER_ACCOUNT_STATE = null;

class StoreService {
  constructor() {
    // TODO: [CONSISTENCY] keep userAccountState structure in sync with backend's IUserPublic
    this._userAccountState = INITIAL_USER_ACCOUNT_STATE;
    this._userCartState = { ...USER_CART_STATE };
    this._productComparisonState = [];
  }

  updateUserAccountState(userAccountState) {
    this._userAccountState = userAccountState;
  }

  clearUserAccountState() {
    this._userAccountState = INITIAL_USER_ACCOUNT_STATE;
  }

  updateUserCartState(userCartState) {
    this._userCartState.totalPrice += userCartState.price;

    const productIndexInCart = this._userCartState.products.findIndex(
      (productItem) => productItem.name === userCartState.name
    );
    if (productIndexInCart !== -1) {
      this._userCartState.products[productIndexInCart].count++;
    } else {
      userCartState.count = 1;
      this._userCartState.products.push(userCartState);
    }

    this._userCartState.totalCount++;
  }

  clearUserCartState() {
    this._userCartState.products.splice(0, this._userCartState.products.length);

    this._userCartState.totalPrice = 0;
    this._userCartState.totalCount = 0;
  }

  replaceUserCartState(newState) {
    if (newState) {
      this._userCartState = observable(newState);
    }
  }

  updateProductComparisonState({ add, remove }) {
    console.log('(updateProductComparisonState) /add:', add, ' /remove:', remove);

    if (add) {
      this._productComparisonState.push(add);
    } else if (typeof remove.index === 'number') {
      this._productComparisonState.splice(remove.index, 1);
    } else if (remove._id) {
      const removeIndex = this._productComparisonState.findIndex((product) => product._id === remove._id);
      this._productComparisonState.splice(removeIndex, 1);
    }
  }

  clearProductComparisonState() {
    this._productComparisonState.length = 0;
  }

  get userCartState() {
    return this._userCartState;
  }

  get userCartProducts() {
    return this._userCartState.products;
  }

  get userCartTotalPrice() {
    return this._userCartState.totalPrice;
  }

  get userCartProductsCount() {
    return this._userCartState.totalCount;
  }

  get userAccountState() {
    return this._userAccountState;
  }

  get productComparisonState() {
    return this._productComparisonState;
  }
}

decorate(StoreService, {
  _userAccountState: observable,
  updateUserAccountState: action,
  clearUserAccountState: action,

  _userCartState: observable,
  updateUserCartState: action,
  clearUserCartState: action,

  _productComparisonState: observable,
  updateProductComparisonState: action,
  clearProductComparisonState: action,
});

const storeService = new StoreService();

export default storeService;
