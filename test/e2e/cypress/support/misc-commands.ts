import { cy, Cypress, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { TE2E, IUserCart, HTTP_STATUS_CODE } from '@commons/types';

Cypress.Commands.add('getFromStorage', (key) => {
  return cy.window().then((window) => JSON.parse(window.localStorage.getItem(key) as string));
});

Cypress.Commands.add('cleanupTestUsersAndEmails', () => {
  cy.visit(ROUTES.ROOT);
  cy.deleteEmails().as('deleteEmails');
  cy.removeTestUsers(false)
    .then((res) => {
      expect(res.status).to.be.oneOf([HTTP_STATUS_CODE.NO_CONTENT, HTTP_STATUS_CODE.NOT_FOUND]);
    })
    .as('removeTestUsers');
  cy.get('@deleteEmails');
  cy.get('@removeTestUsers');
});

// TODO: remove it when `TAPIEndpointGroup` will be fixed, so type will be checked at compile time instead of runtime
const _endpointGroups = ['users', 'products'];
Cypress.Commands.add('sendAPIReq', ({ endpoint, method, payload, extraHeaders = {}, canFail = true }) => {
  if (!endpoint || !method) {
    throw ReferenceError(
      `'endpoint', 'method' must be defined!
        Received accordingly: '${endpoint}', '${method}'.`
    );
  } else if (endpoint.includes('/') && !_endpointGroups.some((group) => !endpoint.startsWith(group))) {
    throw TypeError(
      `endpoint containing a slash should start with either of _endpointGroups!
      Received: "${endpoint}".`
    );
  }

  return cy.request({
    failOnStatusCode: canFail,
    url: `/api/${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: payload && JSON.stringify(payload),
  });
});

Cypress.Commands.add('cleanupCartState', () => {
  cy.window().then((win: Cypress.AUTWindow & { __E2E__: TE2E }) => {
    win.__E2E__.storeService.clearUserCartState();
    win.__E2E__.storageService.userCart.remove();
  });
});

Cypress.Commands.add('findProductByNameInCartStore', (productName) => {
  return cy
    .window()
    .then(
      (win: Cypress.AUTWindow & { __E2E__: TE2E }) =>
        win.__E2E__.storeService.userCartProducts.find(
          ({ name }) => name === productName
        ) as IUserCart['products'][number]
    );
});
