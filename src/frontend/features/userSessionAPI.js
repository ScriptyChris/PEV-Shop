import appStore from './appStore';
import { USER_ACCOUNT_STATE, USER_SESSION_STATE } from './storageApi';
import apiService from './apiService';

function startSession(userSession) {
  const authToken = apiService.getAuthToken();

  if (!userSession || !authToken) {
    throw ReferenceError(
      `Could not start session due to lack of userSession: '${userSession}' or authToken: '${authToken}'!`
    );
  }

  appStore.updateUserSessionState(userSession);
  USER_ACCOUNT_STATE.updateStorage(userSession);
  USER_SESSION_STATE.updateStorage(authToken);
}

function endSession() {
  appStore.updateUserSessionState(null);
  USER_ACCOUNT_STATE.removeFromStorage();
}

// TODO: [FEATURE] check if authToken has expired and, if so, refresh it
function restoreSession() {
  const userAccount = USER_ACCOUNT_STATE.getFromStorage();
  const userSession = USER_SESSION_STATE.getFromStorage();

  console.log('(restoreSession) userSession:', userSession, ' /userAccount:', userAccount);

  if ((userAccount && !userSession) || (!userAccount && userSession)) {
    throw Error(`User account and session are not synced! userAccount: ${userAccount}; userSession: ${userSession}`);
  } else if (userAccount && userSession) {
    apiService.setAuthToken(userSession);
    appStore.updateUserSessionState(userSession);
  }
}

export { startSession, endSession, restoreSession };
