function updateStorage({ key, value }, shouldRemove) {
  try {
    if (shouldRemove()) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('updateStorage error:', error, ' /key:', key, ' /value:', value);
  }
}

function getFromStorage(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    console.error('getFromStorage error:', error, ' /key:', key);
    return null;
  }
}

function removeFromStorage(key) {
  updateStorage({ key }, () => true);
}

const USER_CART_STATE = Object.freeze({
  __KEY__: 'userCartState',
  updateStorage(cartState) {
    updateStorage(
      { key: this.__KEY__, value: cartState },
      () => !cartState || cartState.toString() !== '[object Object]' || cartState.totalCount === 0
    );
  },
  getFromStorage() {
    return getFromStorage(this.__KEY__);
  },
});

const USER_ACCOUNT_STATE = Object.freeze({
  __KEY__: 'userAccountState',
  updateStorage(accountState) {
    updateStorage(
      { key: this.__KEY__, value: accountState },
      () => !accountState || accountState.toString() !== '[object Object]'
    );
  },
  getFromStorage() {
    return getFromStorage(this.__KEY__);
  },
  removeFromStorage() {
    removeFromStorage(this.__KEY__);
  },
});

const USER_SESSION_STATE = Object.freeze({
  __KEY__: 'userSessionState',
  updateStorage(sessionState) {
    updateStorage({ key: this.__KEY__, value: sessionState }, () => !sessionState || typeof sessionState !== 'string');
  },
  getFromStorage() {
    return getFromStorage(this.__KEY__);
  },
  removeFromStorage() {
    removeFromStorage(this.__KEY__);
  },
});

export { USER_CART_STATE, USER_ACCOUNT_STATE, USER_SESSION_STATE };
