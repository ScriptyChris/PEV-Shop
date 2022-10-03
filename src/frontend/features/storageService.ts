import type { IUserCart } from '@src/types';
import type { IUser, TUserPublic } from '@database/models/_user';

type TStorageValue = IUserCart | TUserPublic | NonNullable<IUser['tokens']['auth']>[number] | null;

const storageService = (() => {
  class StorageService {
    key: string;

    constructor(key: string) {
      this.key = key;
    }

    update(value: TStorageValue, checkIfShouldRemove: () => boolean) {
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
        return JSON.parse(String(window.localStorage.getItem(this.key)));
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
    constructor(key: string) {
      super(key);
    }

    update(cartState: IUserCart) {
      super.update(cartState, () => !cartState || typeof cartState !== 'object' || cartState.totalCount === 0);
    }
  }

  class UserAccount extends StorageService {
    constructor(key: string) {
      super(key);
    }

    update(accountState: TUserPublic) {
      super.update(accountState, () => !accountState || typeof accountState !== 'object');
    }
  }

  class UserAuthToken extends StorageService {
    constructor(key: string) {
      super(key);
    }

    update(authToken: NonNullable<IUser['tokens']['auth']>[number]) {
      super.update(authToken, () => !authToken || typeof authToken !== 'string');
    }
  }

  return {
    userCart: new UserCart('userCart'),
    userAccount: new UserAccount('userAccount'),
    userAuthToken: new UserAuthToken('userAuthToken'),
  };
})();

if (window.Cypress) {
  window.__E2E__.storageService = storageService;
}

export default storageService;
