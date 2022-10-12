import { cy, Cypress, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import type { TE2E } from '@src/types';
import type { TUserPublic } from '@database/models/_user';
import { makeCyDataSelector } from '../synchronous-helpers';

Cypress.Commands.add('registerTestUserByUI', ({ login, email }) => {
  const password = 'test password';

  cy.visit(ROUTES.REGISTER);
  cy.get(makeCyDataSelector('input:register-login')).type(login);
  cy.get(makeCyDataSelector('input:register-password')).type(password);
  cy.get(makeCyDataSelector('input:register-repeated-password')).type(password);
  cy.get(makeCyDataSelector('input:register-email')).type(email);
  cy.get(makeCyDataSelector('input:register-account-client-type')).check();
  cy.get(makeCyDataSelector('button:submit-register')).click();
  cy.get(makeCyDataSelector('popup:user-successfully-registered'))
    .should('be.visible')
    .find(makeCyDataSelector(`button:resend-register-email`))
    .should('be.visible');
});

Cypress.Commands.add('confirmTestUserRegistrationByUI', (email) => {
  return cy.getAccountActivationLinkFromEmail(email).then((link) => {
    cy.intercept('/api/users/confirm-registration', (req) => {
      req.continue((res) => {
        expect(res.body.payload.isUserConfirmed).to.be.true;
      });
    }).as('confirmRegistration');

    cy.visit(`${link.pathname}${link.search}`);
    cy.wait('@confirmRegistration');
    cy.contains(
      makeCyDataSelector('message:registration-confirmation-succeeded-hint'),
      'You can now click here to log in to your new account.'
    );
  });
});

Cypress.Commands.add('registerTestUser', (testUser, canFail) => {
  return cy.sendAPIReq({
    endpoint: 'users/register',
    method: 'POST',
    payload: testUser,
    canFail,
  });
});

Cypress.Commands.add('confirmTestUserRegistration', (email) => {
  return cy
    .getAccountActivationLinkFromEmail(email)
    .then((link) => {
      const token = (new URLSearchParams(link.search).get('token') as string).replace(/\s/g, '+');

      return cy.sendAPIReq({
        endpoint: 'users/confirm-registration',
        method: 'POST',
        payload: { token },
      });
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

      return res as TUserPublic;
    });
});

Cypress.Commands.add('loginTestUser', (testUser, canFail) => {
  return cy.sendAPIReq({
    endpoint: 'users/login',
    method: 'POST',
    payload: testUser,
    canFail,
  });
});

Cypress.Commands.add('loginTestUserByUI', (testUser) => {
  cy.get(makeCyDataSelector('input:login')).type(testUser.login);
  cy.get(makeCyDataSelector('input:password')).type(testUser.password);
  cy.intercept('/api/users/login', (req) => {
    req.continue((res) => {
      expect(res.body.payload).to.include({
        login: testUser.login,
        email: testUser.email,
      });
      expect(res.body).to.have.property('authToken').to.be.a('string').that.is.not.empty;
    });
  }).as('loginUser');
  cy.get(makeCyDataSelector('button:submit-login')).click();
  cy.wait('@loginUser').then((interception) => {
    // expose `authToken` to whatever caller, which may potentially need it
    cy.wrap(interception.response!.body.authToken).as('_authToken');
  });
});

Cypress.Commands.add('logoutUserFromAllSessions', (authToken) => {
  return cy.sendAPIReq({
    endpoint: 'users/logout-all',
    method: 'POST',
    extraHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
});

Cypress.Commands.add('removeTestUsers', (canFail) => {
  return cy.sendAPIReq({
    endpoint: 'users/delete',
    method: 'DELETE',
    payload: {
      queryType: 'regex',
      rawQuery: 'test user',
    },
    canFail,
  });
});
