const storageService = (() => {
  class StorageService {
    constructor(key) {
      this.key = key;
    }

    update(value, checkIfShouldRemove) {
      try {
        if (checkIfShouldRemove()) {
          window.localStorage.removeItem(this.key);
          return;
        }

        window.localStorage.setItem(this.key, JSON.stringify(value));
      } catch (error) {
        console.error('updateStorage error:', error, ' /this.key:', this.key, ' /value:', value);
      }
    }

    get() {
      try {
        return JSON.parse(window.localStorage.getItem(this.key));
      } catch (error) {
        console.error('getFromStorage error:', error, ' /this.key:', this.key);
        return null;
      }
    }

    remove() {
      this.update(null, () => true);
    }
  }

  class UserCart extends StorageService {
    constructor(key) {
      super(key);
    }

    update(cartState) {
      super.update(cartState, () => !cartState || typeof cartState !== 'object' || cartState.totalCount === 0);
    }
  }

  class UserAccount extends StorageService {
    constructor(key) {
      super(key);
    }

    update(accountState) {
      super.update(accountState, () => !accountState || typeof accountState !== 'object');
    }
  }

  class UserAuthToken extends StorageService {
    constructor(key) {
      super(key);
    }

    update(authToken) {
      super.update(authToken, () => !authToken || typeof authToken !== 'string');
    }
  }

  return {
    userCart: new UserCart('userCart'),
    userAccount: new UserAccount('userAccount'),
    userAuthToken: new UserAuthToken('userAuthToken'),
  };
})();

export default storageService;
