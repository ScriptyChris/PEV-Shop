/**
 * @module
 */

import storeService from './storeService';
import storageService from './storageService';
import httpService, { CUSTOM_RES_EXT_DICT } from './httpService';
import type { IUser, TUserPublic } from '@database/models';

type TLogInCredentials = Pick<IUser, 'login' | 'password'>;

const userSessionService = {
  async logIn(logInCredentials: TLogInCredentials) {
    return httpService.loginUser(logInCredentials).then((res) => {
      if (CUSTOM_RES_EXT_DICT.__EXCEPTION_ALREADY_HANDLED in res) {
        return res;
      }

      const userAccount = res as TUserPublic;
      const authToken = httpService.getAuthToken();

      if (!userAccount || !authToken) {
        throw ReferenceError(
          `Could not start session due to lack of userAccount: '${userAccount}' or authToken: '${authToken}'!`
        );
      }

      storeService.updateUserAccountState(userAccount);
      storageService.userAccount.update(userAccount);
      storageService.userAuthToken.update(authToken);

      return res;
    });
  },

  async logOut() {
    return httpService.logoutUser().then((res) => {
      if (CUSTOM_RES_EXT_DICT.__EXCEPTION_ALREADY_HANDLED in res) {
        return res;
      }

      storeService.clearUserAccountState();
      storageService.userAccount.remove();
      storageService.userAuthToken.remove();

      return res;
    });
  },

  async logOutFromMultipleSessions(shouldPreserveCurrentSession: boolean) {
    return httpService
      .disableGenericErrorHandler()
      .logOutUserFromSessions(shouldPreserveCurrentSession)
      .then((res) => {
        if (CUSTOM_RES_EXT_DICT.__EXCEPTION_ALREADY_HANDLED in res) {
          return res;
        } else if (!shouldPreserveCurrentSession) {
          storeService.clearUserAccountState();
          storageService.userAccount.remove();
          storageService.userAuthToken.remove();
        }

        return res;
      });
  },

  // TODO: [FEATURE] check if authToken has expired and, if so, refresh it
  restoreSession() {
    const userAccount = storageService.userAccount.get();
    const userAuthToken = storageService.userAuthToken.get();

    if ((userAccount && !userAuthToken) || (!userAccount && userAuthToken)) {
      // TODO: [UX] probably show User some info that session is corrupted(?) and there is need to log in again?
      throw Error(
        `User account and auth token states presence is diverged!\n
        userAccount: ${JSON.stringify(userAccount) || userAccount}\n
        userAuthToken: ${userAuthToken}`
      );
    } else if (userAccount && userAuthToken) {
      httpService.setAuthToken(userAuthToken);
      storeService.updateUserAccountState(userAccount);
    }
  },
} as const;

if (window.Cypress) {
  window.__E2E__.userSessionService = userSessionService;
}

export default userSessionService;
