import { ROUTES } from '../fixtures/_routes.js';
import { HTTP_STATUS_CODE } from '../fixtures/types.js';
import users from '../fixtures/initial-users.json';

const exampleUser = users[0];

describe('#login', () => {
  it('should login to default user account', () => {
    cy.visit('/');

    cy.get(`a[href="${ROUTES.LOG_IN}"]`).should('exist').click();

    cy.get('#login').type(exampleUser.login);
    cy.get('#password').type(exampleUser.password);
    cy.intercept('/api/users/login', (req) => {
      req.on('response', (res) => {
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
      req.on('response', (res) => {
        expect(res.statusCode).to.equal(HTTP_STATUS_CODE.UNAUTHORIZED);
        expect(res.body.error).to.equal('Invalid credentials!');
      });
    });
    cy.get('[type="submit"]').click();
    cy.contains('.popup__message', 'Sorry, but an unexpected error occured :(');
  });
});
