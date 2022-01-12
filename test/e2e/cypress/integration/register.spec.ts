import { cy, describe, it, beforeEach, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { HTTP_STATUS_CODE, TE2EUser } from '@commons/types';
import { makeCyDataSelector } from '../synchronous-helpers';

describe('#register', () => {
  const testUsers: Pick<TE2EUser, 'login' | 'email'>[] = [
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

  beforeEach(() => {
    cy.cleanupTestUsersAndEmails();
  });

  it('should register a new user', () => {
    cy.get(makeCyDataSelector(`link:${ROUTES.REGISTER}`))
      .should('exist')
      .click();
    cy.registerTestUserByUI(testUsers[0]);
    cy.confirmTestUserRegistrationByUI(testUsers[0].email);
  });

  it('should re-send registration confirmation email', () => {
    const expectMatchingEmailsCount = (countExpectance: number) => {
      cy.getMatchingEmails(testUsers[1].email, 'Account activation').then((matchingEmails) => {
        expect(matchingEmails.length).to.be.eq(countExpectance);
      });
    };

    cy.get(makeCyDataSelector(`link:${ROUTES.REGISTER}`)).click();
    cy.registerTestUserByUI(testUsers[1]);

    expectMatchingEmailsCount(1);
    cy.intercept('/api/users/resend-confirm-registration', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.be.eq(HTTP_STATUS_CODE.CREATED);
        expect(res.body.message).to.be.eq('User account created! Check your email.');
      });
    }).as('reSendConfirmation');
    cy.get(makeCyDataSelector('button:resend-register-email')).should('have.text', 'Re-send email').click();
    cy.wait('@reSendConfirmation');
    expectMatchingEmailsCount(2);
  });

  it('should redirect to login page from confirm registration page', () => {
    cy.visit(ROUTES.REGISTER);
    cy.registerTestUserByUI(testUsers[2]);
    cy.getAccountActivationLinkFromEmail(testUsers[2].email).then((link) => {
      return cy.visit(`${link.pathname}${link.search}`);
    });
    cy.get(makeCyDataSelector(`link:${ROUTES.LOG_IN}`)).click();
    cy.location('pathname').should('eq', ROUTES.LOG_IN);
  });
});
