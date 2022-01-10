import { ROUTES } from '../fixtures/_routes.js';
import { HTTP_STATUS_CODE } from '../fixtures/types.js';

describe('#register', () => {
  const testUsers = [
    {
      login: 'test user 1',
      email: 'test_user_1@example.org',
    },
    {
      login: 'test user 2',
      email: 'test_user_2@example.org',
    },
    {
      login: 'test user 3',
      email: 'test_user_3@example.org',
    },
  ];
  const fillAndSendRegisterForm = ({ login, email }) => {
    cy.get('#registrationLogin').type(login);
    cy.get('#password').type('test password');
    cy.get('#repeatedPassword').type('test password');
    cy.get('#registrationEmail').type(email);
    cy.get('#registrationAccountClientType').check();
    cy.get('[type="submit"]').click();
  };

  beforeEach(() => {
    cy.visit(ROUTES.ROOT);
    cy.deleteEmails();
  });

  it('should register a new user', () => {
    cy.get(`a[href="${ROUTES.REGISTER}"]`).should('exist').click();
    fillAndSendRegisterForm(testUsers[0]);

    cy.getLinkFromEmail(testUsers[0].email, 'Account activation', '/pages/confirm-registration').then((url) => {
      cy.intercept('/api/users/confirm-registration', (req) => {
        req.continue((res) => expect(res.body.payload.isUserConfirmed).to.be.true);
      }).as('confirmRegistration');

      cy.visit(url);
      cy.wait('@confirmRegistration');
    });
  });

  it('should re-send registration confirmation email', () => {
    const expectMatchingEmailsCount = (countExpectance) => {
      cy.getMatchingEmails(testUsers[1].email, 'Account activation').then((matchingEmails) => {
        expect(matchingEmails.length).to.be.eq(countExpectance);
      });
    };

    cy.get(`a[href="${ROUTES.REGISTER}"]`).click();
    fillAndSendRegisterForm(testUsers[1]);

    expectMatchingEmailsCount(1);
    cy.intercept('/api/users/resend-confirm-registration', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(HTTP_STATUS_CODE.CREATED);
        expect(res.body.message).to.be.eq('User account created! Check your email.');
      });
    }).as('reSendConfirmation');
    cy.contains('button', 'Re-send email').click();
    cy.wait('@reSendConfirmation');
    expectMatchingEmailsCount(2);
  });

  it('should redirect to login page from registration popup', () => {
    cy.visit(ROUTES.REGISTER);
    fillAndSendRegisterForm(testUsers[2]);
    cy.contains('button', 'Go to login').click();
    cy.location('pathname').should('eq', ROUTES.LOG_IN);
  });
});
