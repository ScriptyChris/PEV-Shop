import { cy, Cypress, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import type { TE2E } from '@src/types';

const userAPIReq = (urlSuffix: string, method: string, payload: any, canFail = true) => {
  if (!urlSuffix || !method || !payload) {
    throw ReferenceError(
      `'urlSuffix', 'method' and 'payload' must be defined! 
          Received accordingly: '${urlSuffix}', '${method}' and '${JSON.stringify(payload)}'.`
    );
  }

  return cy.request({
    failOnStatusCode: canFail,
    url: `/api/users/${urlSuffix}`,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

Cypress.Commands.add('registerTestUserByUI', ({ login, email }) => {
  const password = 'test password';

  cy.visit(ROUTES.REGISTER);
  cy.get('[data-cy="input:register-login"]').type(login);
  cy.get('[data-cy="input:register-password"]').type(password);
  cy.get('[data-cy="input:register-repeated-password"]').type(password);
  cy.get('[data-cy="input:register-email"]').type(email);
  cy.get('[data-cy="input:register-account-client-type"]').check();
  cy.get('[data-cy="button:submit-register"]').click();
  cy.contains(`[data-cy="button:go-to-login-from-register"]`, 'Go to login');
});

Cypress.Commands.add('confirmTestUserRegistrationByUI', (email) => {
  return cy.getLinkFromEmail(email, 'Account activation', '/pages/confirm-registration').then((link) => {
    cy.intercept('/api/users/confirm-registration', (req) => {
      req.continue((res) => {
        expect(res.body.payload.isUserConfirmed).to.be.true;
      });
    }).as('confirmRegistration');

    cy.visit(`${link.pathname}${link.search}`);
    cy.wait('@confirmRegistration');
    cy.contains(
      '[data-cy="message:registration-confirmation-succeeded-hint"]',
      'You can now log in to your new account.'
    );
  });
});

Cypress.Commands.add('registerTestUser', (testUser, canFail?) => {
  return userAPIReq('register', 'POST', testUser, canFail);
});

Cypress.Commands.add('confirmTestUserRegistration', (email) => {
  return cy
    .getLinkFromEmail(email, 'Account activation', '/pages/confirm-registration')
    .then((link) => {
      const token = (new URLSearchParams(link.search).get('token') as string).replace(/\s/g, '+');

      return userAPIReq('confirm-registration', 'POST', { token });
    })
    .then((res) => expect(res.body.payload.isUserConfirmed).to.be.true);
});

Cypress.Commands.add('registerAndLoginTestUser', (testUser) => {
  return cy
    .registerTestUser(testUser)
    .then(() => cy.confirmTestUserRegistration(testUser.email))
    .then(() => cy.window())
    .then((win: Cypress.AUTWindow & { __E2E__: TE2E }) => win.__E2E__.userSessionService.logIn(testUser))
    .then((res) => {
      expect(res).to.include({
        login: testUser.login,
        email: testUser.email,
      });

      return res;
    });
});

Cypress.Commands.add('registerAndLoginTestUserByUI', (testUser) => {
  cy.registerTestUserByUI(testUser);
  cy.confirmTestUserRegistrationByUI(testUser.email);
  cy.get('[data-cy="button:log-in-after-confirmed-registration"]').click();

  return cy.loginTestUserByUI(testUser);
});

Cypress.Commands.add('loginTestUser', (testUser, canFail) => {
  return userAPIReq('login', 'POST', testUser, canFail);
});

Cypress.Commands.add('loginTestUserByUI', (testUser) => {
  cy.get('[data-cy="input:login"]').type(testUser.login);
  cy.get('[data-cy="input:password"]').type(testUser.password);
  cy.intercept('/api/users/login', (req) => {
    req.continue((res) => {
      expect(res.body.payload).to.include({
        login: testUser.login,
        email: testUser.email,
      });
    });
  }).as('loginUser');
  cy.get('[data-cy="button:submit-login"]').click();
  cy.wait('@loginUser');
});

Cypress.Commands.add('removeTestUsers', (canFail) => {
  return userAPIReq(
    'delete',
    'DELETE',
    {
      queryType: 'regex',
      rawQuery: 'test user',
    },
    canFail
  );
});
