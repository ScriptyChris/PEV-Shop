import { ROUTES } from '../fixtures/_routes.js';
import { HTTP_STATUS_CODE } from '../fixtures/types.js';
import users from '../fixtures/initial-users.json';

const exampleUser = users[0];

describe('#login', () => {
  beforeEach(() => {
    cy.visit(ROUTES.ROOT);
    cy.deleteEmails().as('deleteEmails');
    cy.removeTestUsers().as('removeTestUsers');
    cy.get('@deleteEmails');
    cy.get('@removeTestUsers');
  });

  it('should login to default user account', () => {
    cy.get(`a[href="${ROUTES.LOG_IN}"]`).should('exist').click();

    cy.get('#login').type(exampleUser.login);
    cy.get('#password').type(exampleUser.password);
    cy.intercept('/api/users/login', (req) => {
      req.continue((res) => {
        expect(res.body.payload).to.include({
          login: exampleUser.login,
          email: exampleUser.email,
        });
      });
    });
    cy.get('[type="submit"]').click();

    cy.location('pathname').should('eq', '/');
    cy.get(`a[href="${ROUTES.LOG_IN}"]`).should('not.exist');
  });

  it('should handle invalid credentials case', () => {
    cy.visit(ROUTES.LOG_IN);
    cy.get('#login').type('non existing user');
    cy.get('#password').type('non existing password');
    cy.intercept('/api/users/login', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.equal(HTTP_STATUS_CODE.UNAUTHORIZED);
        expect(res.body.error).to.equal('Invalid credentials!');
      });
    });
    cy.get('[type="submit"]').click();
    cy.contains('.popup__message', 'Sorry, but an unexpected error occured :(');
  });

  it('should handle non-confirmed user account', () => {
    const testUser = {
      login: 'non confirmed test user',
      password: 'password',
      email: 'non_confirmed_test_user@example.org',
      accountType: 'client',
    };

    cy.registerTestUser(testUser).as('registerNonConfirmedUser');
    cy.get('@registerNonConfirmedUser');

    cy.visit(ROUTES.LOG_IN);
    cy.get('#login').type(testUser.login);
    cy.get('#password').type(testUser.password);
    cy.intercept('/api/users/login', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(HTTP_STATUS_CODE.UNAUTHORIZED);
        expect(res.body.error).to.be.eq('User registration is not confirmed!');
      });
    }).as('loginNonConfirmedUser');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginNonConfirmedUser');
  });

  it('should reset user password', () => {
    const testUser = {
      login: 'reset password test user',
      email: 'reset_password_test_user@example.org',
      password: 'test password',
      accountType: 'client',
    };
    const TEST_USER_NEW_PASSWORD = 'new test password';

    cy.registerTestUser(testUser).then(() => {
      // TODO: [DEV] refactor this to a reusable command (`register.spec.js` should also use it)
      cy.getLinkFromEmail(testUser.email, 'Account activation', '/pages/confirm-registration').then((url) => {
        cy.intercept('/api/users/confirm-registration', (req) => {
          req.continue((res) => expect(res.body.payload.isUserConfirmed).to.be.true);
        }).as('confirmRegistration');

        cy.visit(url);
        cy.wait('@confirmRegistration');
      });
    });

    cy.visit(ROUTES.LOG_IN);
    cy.loginTestUser({
      login: testUser.login,
      password: testUser.password,
    }).then((res) => expect(res.status).to.be.eq(HTTP_STATUS_CODE.OK));

    cy.get('a[href="/pages/reset-password"]').click();
    cy.get('#resettingEmail').type(testUser.email);
    cy.intercept('/api/users/reset-password', (req) => {
      req.continue((res) => {
        expect(res.body.message).to.be.eq('Password resetting process began! Check your email.');
      });
    }).as('resetPassword');
    cy.contains('button', 'Reset').click();
    cy.wait('@resetPassword');

    cy.getLinkFromEmail(testUser.email, 'Reset password', '/pages/set-new-password').then((url) => {
      cy.intercept('/api/users/set-new-password', (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.be.eq(HTTP_STATUS_CODE.CREATED);
          expect(res.body.message).to.be.eq('Password updated!');
        });
      }).as('setNewPassword');
      cy.visit(url);
    });
    cy.get('#newPassword').type(TEST_USER_NEW_PASSWORD);
    cy.get('#repeatedNewPassword').type(TEST_USER_NEW_PASSWORD);
    cy.contains('button', 'Update password').click();
    cy.wait('@setNewPassword');

    cy.contains('button', 'Go to log in').click();
    cy.location('pathname').should('eq', ROUTES.LOG_IN);
    cy.loginTestUser({
      login: testUser.login,
      password: TEST_USER_NEW_PASSWORD,
    }).then((res) => expect(res.status).to.be.eq(HTTP_STATUS_CODE.OK));
    cy.loginTestUser(
      {
        login: testUser.login,
        password: testUser.password,
      },
      false
    ).then((res) => expect(res.status).to.be.eq(HTTP_STATUS_CODE.UNAUTHORIZED));
  });
});
