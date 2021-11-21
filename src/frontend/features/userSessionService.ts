import storeService from './storeService';
import storageService from './storageService';
import httpService from './httpService';

const userSessionService = Object.freeze({
  logIn(credentials) {
    return httpService.loginUser(credentials).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return res;
      }

      const userAccount = res;
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

  logOut() {
    return httpService.logoutUser().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return res;
      }

      storeService.clearUserAccountState();
      storageService.userAccount.remove();
      storageService.userAuthToken.remove();

      return res;
    });
  },

  logOutFromMultipleSessions(shouldPreserveCurrentSession) {
    return httpService
      .disableGenericErrorHandler()
      .logOutUserFromSessions(shouldPreserveCurrentSession)
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
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
});

export default userSessionService;
