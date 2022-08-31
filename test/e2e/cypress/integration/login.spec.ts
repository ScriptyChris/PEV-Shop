import { cy, describe, beforeEach, it, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { HTTP_STATUS_CODE, TE2EUser } from '@src/types';
import { makeCyDataSelector } from '../synchronous-helpers';
import * as users from '@database/populate/initial-users.json';

const exampleUser = (users as TE2EUser[])[0];

describe('#login', () => {
  beforeEach(() => {
    cy.cleanupTestUsersAndEmails();
  });

  it('should login to default user account', () => {
    cy.get(makeCyDataSelector(`link:${ROUTES.LOG_IN}`))
      .should('exist')
      .click();

    cy.get(makeCyDataSelector('input:login')).type(exampleUser.login);
    cy.get(makeCyDataSelector('input:password')).type(exampleUser.password);
    cy.intercept('/api/users/login', (req) => {
      req.continue((res) => {
        expect(res.body.payload).to.include({
          login: exampleUser.login,
          email: exampleUser.email,
        });
      });
    });
    cy.get(makeCyDataSelector('button:submit-login')).click();

    cy.location('pathname').should('eq', ROUTES.ROOT);
    cy.get(makeCyDataSelector(`link:${ROUTES.LOG_IN}`)).should('not.exist');
  });

  it('should handle invalid credentials case', () => {
    cy.visit(ROUTES.LOG_IN);
    cy.get(makeCyDataSelector('input:login')).type('non existing user');
    cy.get(makeCyDataSelector('input:password')).type('non existing password');
    cy.intercept('/api/users/login', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.equal(HTTP_STATUS_CODE.UNAUTHORIZED);
        expect(res.body.error).to.equal('Invalid credentials!');
      });
    });
    cy.get(makeCyDataSelector('button:submit-login')).click();
    cy.get(makeCyDataSelector('popup:message')).should('have.text', 'Sorry, but an unexpected error occured :(');
  });

  it('should handle non-confirmed user account', () => {
    const TEST_USER = Object.freeze({
      login: 'non confirmed test user',
      password: 'password',
      email: 'non_confirmed_test_user@example.org',
      accountType: 'client',
    });

    cy.registerTestUser(TEST_USER).as('registerNonConfirmedUser');
    cy.get('@registerNonConfirmedUser');

    cy.visit(ROUTES.LOG_IN);
    cy.get(makeCyDataSelector('input:login')).type(TEST_USER.login);
    cy.get(makeCyDataSelector('input:password')).type(TEST_USER.password);
    cy.intercept('/api/users/login', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(HTTP_STATUS_CODE.UNAUTHORIZED);
        expect(res.body.error).to.be.eq('User registration is not confirmed!');
      });
    }).as('loginNonConfirmedUser');
    cy.get(makeCyDataSelector('button:submit-login')).click();
    cy.wait('@loginNonConfirmedUser');
  });

  it('should reset user password', () => {
    const TEST_USER = Object.freeze({
      login: 'reset password test user',
      email: 'reset_password_test_user@example.org',
      password: 'test password',
      accountType: 'client',
    });
    const TEST_USER_NEW_PASSWORD = 'new test password';

    cy.registerTestUser(TEST_USER).then(() => cy.confirmTestUserRegistrationByUI(TEST_USER.email));

    cy.visit(ROUTES.LOG_IN);
    cy.loginTestUser({
      login: TEST_USER.login,
      password: TEST_USER.password,
    }).then((res) => expect(res.status).to.be.eq(HTTP_STATUS_CODE.OK));

    cy.get(makeCyDataSelector(`link:${ROUTES.RESET_PASSWORD}`)).click();
    cy.get(makeCyDataSelector('input:reset-email')).type(TEST_USER.email);
    cy.intercept('/api/users/reset-password', (req) => {
      req.continue((res) => {
        expect(res.body.message).to.be.eq('Password resetting process began! Check your email.');
      });
    }).as('resetPassword');
    cy.get(makeCyDataSelector('button:submit-reset')).should('have.text', 'Reset').click();
    cy.wait('@resetPassword');

    cy.getLinkFromEmail(TEST_USER.email, 'Reset password', '/pages/set-new-password').then((link) => {
      cy.intercept('/api/users/set-new-password', (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.be.eq(HTTP_STATUS_CODE.CREATED);
          expect(res.body.message).to.be.eq('Password updated!');
        });
      }).as('setNewPassword');
      cy.visit(`${link.pathname}${link.search}`);
    });
    cy.get(makeCyDataSelector('input:new-password')).type(TEST_USER_NEW_PASSWORD);
    cy.get(makeCyDataSelector('input:repeated-new-password')).type(TEST_USER_NEW_PASSWORD);
    cy.get(makeCyDataSelector('button:submit-new-password')).should('have.text', 'Update password').click();
    cy.wait('@setNewPassword');

    cy.get(makeCyDataSelector('button:go-to-login-from-new-password')).should('have.text', 'Go to log in').click();
    cy.location('pathname').should('eq', ROUTES.LOG_IN);
    cy.loginTestUser({
      login: TEST_USER.login,
      password: TEST_USER_NEW_PASSWORD,
    }).then((res) => expect(res.status).to.be.eq(HTTP_STATUS_CODE.OK));
    cy.loginTestUser(
      {
        login: TEST_USER.login,
        password: TEST_USER.password,
      },
      false
    ).then((res) => expect(res.status).to.be.eq(HTTP_STATUS_CODE.UNAUTHORIZED));
  });
});
