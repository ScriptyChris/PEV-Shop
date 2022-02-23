import fetch from 'node-fetch';

type TUserLoginCredentials = { login: string; password: string };

const API_USERS_URL = `${process.env.CYPRESS_BASE_URL}/api/users`;
const CONTENT_TYPE = Object.freeze({
  'Content-Type': 'application/json',
});

const loginUserByAPI = (payload: TUserLoginCredentials) =>
  fetch(`${API_USERS_URL}/login`, {
    method: 'POST',
    headers: {
      ...CONTENT_TYPE,
    },
    body: JSON.stringify(payload),
  });
// TODO: [refactor - E2E] the check should be more robust than relying on observed products feature
const checkUserSessionByAPI = (authToken: string) =>
  fetch(`${API_USERS_URL}/observed-products`, {
    method: 'GET',
    headers: {
      ...CONTENT_TYPE,
      Authorization: `Bearer ${authToken}`,
    },
  });
const fetchErrorHandler = (errorLogMessage: string) => {
  return (error: any) => {
    console.log(`${errorLogMessage}:`, error);

    return null;
  };
};

const plugin: Cypress.PluginConfig = (on) => {
  on('task', {
    startAlternativeSession(userLoginCredentials: TUserLoginCredentials) {
      return loginUserByAPI(userLoginCredentials)
        .then((res) => res.json())
        .catch(fetchErrorHandler('loginToAltSessionError'));
    },

    checkAlternativeSession(authToken: string) {
      return (
        checkUserSessionByAPI(authToken)
          /*
            Cypress doesn't seem to support transferring complex objects, 
            like Fetch'es response with under hood's `.json()` method, across runtimes. 
            Thus destructuring it beforehand to props needed on caller side.
          */
          .then(async (res) => ({
            ...(await res.json()),
            status: res.status,
          }))
          .catch(fetchErrorHandler('checkAltSessionError'))
      );
    },
  });
};

export default plugin;
