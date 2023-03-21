/**
 * Handles reading and manipulating browser's LocalStorage data.
 * @module
 */

import type { IUserCart } from '@commons/types';
import type { IUser, TUserPublic } from '@database/models';

type TStorageValue =
  | IUserCart
  | TUserPublic
  | NonNullable<IUser['tokens']['auth']>[number]
  | null
  | ReturnType<typeof Date.now>;

/**
 * Manipulating storage data API for various contexts, such as `UserCart` or `UserAccount`.
 */
const storageService = (() => {
  class StorageService {
    key: string;

    constructor(key: string) {
      this.key = key;
    }

    /**
     * Update regarding storage context by either setting given `value` or removing existing one,
     * depending on result of calling `checkIfShouldRemove`.
     */
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

    /**
     * @returns Already parsed (from JSON) stored value.
     */
    get() {
      try {
        return JSON.parse(String(window.localStorage.getItem(this.key)));
      } catch (error) {
        console.error('getFromStorage error:', error, ' /this.key:', this.key);
        return null;
      }
    }

    /**
     * Removes a values.
     */
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

  class RecentWelcomeVisitTimestamp extends StorageService {
    constructor(key: string) {
      super(key);
    }

    update(timestamp: number) {
      super.update(timestamp, () => !timestamp);
    }
  }

  return {
    userCart: new UserCart('userCart'),
    userAccount: new UserAccount('userAccount'),
    userAuthToken: new UserAuthToken('userAuthToken'),
    recentWelcomeVisitTimestamp: new RecentWelcomeVisitTimestamp('recentWelcomeVisitTimestamp'),
    clearAllUserData() {
      Object.keys(this)
        .filter((key) => key.startsWith('user'))
        .forEach((userKey) => window.localStorage.removeItem(userKey));
    },
  };
})();

if (window.Cypress) {
  window.__E2E__.storageService = storageService;
}

export default storageService;
