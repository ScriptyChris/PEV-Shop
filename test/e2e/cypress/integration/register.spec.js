import { ROUTES } from '../fixtures/_routes.js';

describe('#register', () => {
  it('should register a new user', () => {
    cy.visit(ROUTES.ROOT);

    cy.get(`a[href="${ROUTES.REGISTER}"]`).should('exist').click();

    cy.get('#registrationLogin').type('new client');
    cy.get('#password').type('new password');
    cy.get('#repeatedPassword').type('new password');
    cy.get('#registrationEmail').type('new_client@example.org');
    cy.get('#registrationAccountClientType').check();
    cy.get('[type="submit"]').click();

    cy.getEmailContent('new_client@example.org', 'Account activation').then((emailContent) => {
      cy.getLinkFromEmailContent(emailContent, '/pages/confirm-registration').then((url) => {
        cy.intercept('/api/users/confirm-registration', (req) => {
          req.on('response', (res) => expect(res.body.payload.isUserConfirmed).to.be.true);
        });
        cy.visit(url);
      });
    });
  });
});
