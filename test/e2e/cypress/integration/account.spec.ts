import { cy, Cypress, it, describe, context, beforeEach, expect } from 'local-cypress';
import type { IUserPublic } from '@database/models/_user';
import { ROUTES } from '@frontend/components/pages/_routes';
import { HTTP_STATUS_CODE, TE2EUser } from '@src/types';

const ACCOUNT_TEST_USER: TE2EUser = Object.freeze({
  login: 'account test user',
  password: 'password',
  email: 'account_test_user@example.org',
  accountType: 'client',
});

describe('#account', () => {
  const ACCOUNT_URLS = Object.freeze({
    USER_PROFILE: `${ROUTES.ACCOUNT}/user-profile`,
    SECURITY: `${ROUTES.ACCOUNT}/security`,
    OBSERVED_PRODUCTS: `${ROUTES.ACCOUNT}/observed-products`,
    ORDERS: `${ROUTES.ACCOUNT}/orders`,
  });
  const goToNewUserAccount = () => {
    cy.registerAndLoginTestUser(ACCOUNT_TEST_USER);

    // TODO: [UI/AUTH] check why direct navigation to the URL (via address bar) after user has been logged in returns 401
    cy.get(`a[href="${ROUTES.ACCOUNT}"]`).click();
  };

  beforeEach(() => {
    cy.visit(ROUTES.ROOT);
    cy.deleteEmails().as('deleteEmails');
    cy.removeTestUsers().as('removeTestUsers');
    cy.get('@deleteEmails');
    cy.get('@removeTestUsers');
  });

  it('should give access to listed user account features', () => {
    goToNewUserAccount();

    [
      { name: 'Profile', url: ACCOUNT_URLS.USER_PROFILE, dataCySection: 'section:user-profile' },
      { name: 'Security', url: ACCOUNT_URLS.SECURITY, dataCySection: 'section:security' },
      {
        name: 'Observed products',
        url: ACCOUNT_URLS.OBSERVED_PRODUCTS,
        dataCySection: 'section:observed-products',
      },
      { name: 'Orders', url: ACCOUNT_URLS.ORDERS, dataCySection: 'section:orders' },
    ].forEach(({ name, url, dataCySection }) => {
      cy.get('[data-cy="link:account-feature"]').contains(name).and('have.attr', 'href', url).click();
      cy.location('pathname').should('eq', url);
      cy.get(`[data-cy="${dataCySection}"]`).should('be.visible');
    });
  });

  it('should show profile details', () => {
    goToNewUserAccount();

    cy.get(`[data-cy="link:account-feature"][href="${ACCOUNT_URLS.USER_PROFILE}"]`).click();
    cy.getFromStorage('userAccount').then((user: IUserPublic) => {
      const profileDetails = [
        { header: 'login', data: user.login },
        { header: 'email', data: user.email },
        // TODO: [UI] add this check when UI will render it as a list instead array
        // { header: 'observedProductsIDs', data: user.observedProductsIDs },
      ];
      cy.get('[data-cy="section:user-profile"] tr').each(($tr, index) => {
        const detail = profileDetails[index];

        if (detail) {
          cy.wrap($tr).as('tr').get('th').contains(detail.header);
          cy.get('@tr').get('td').contains(detail.data);
        }
      });
    });
  });

  it('should handle unathorized access', () => {
    cy.visit(ROUTES.ACCOUNT);
    cy.location('pathname').should('eq', ROUTES.NOT_LOGGED_IN);
  });

  context('multiple sessions', () => {
    const createAndConfirmMultipleSessions = () => {
      goToNewUserAccount();

      // wait a bit, so backend may create different JWT token, because time will be different
      cy.wait(Cypress.env('WAIT_1_SEC'));

      cy.task<{ authToken: string }>('startAlternativeSession', {
        login: ACCOUNT_TEST_USER.login,
        password: ACCOUNT_TEST_USER.password,
      })
        .then((alternativeSessionRes) => {
          expect(alternativeSessionRes).to.have.property('authToken').which.is.a('string').that.is.not.empty;

          const alternativeAuthToken = alternativeSessionRes.authToken;
          cy.wrap(alternativeAuthToken).as('alternativeAuthToken');

          return cy.task<{ payload: [] }>('checkAlternativeSession', alternativeAuthToken);
        })
        .then(({ payload: observedProducts }) => expect(observedProducts).to.be.an('array').that.is.empty);

      cy.getFromStorage('userAuthToken').then((authToken) => {
        cy.get('@alternativeAuthToken').then((alternativeAuthToken) => {
          expect(authToken).to.be.a('string').that.is.not.empty;
          expect(alternativeAuthToken).to.be.a('string').that.is.not.empty;
          expect(authToken).not.to.be.equal(alternativeAuthToken);
        });
      });
    };

    const confirmEndedAlternativeSession = () => {
      cy.get('@alternativeAuthToken')
        .then((alternativeAuthToken) => cy.task('checkAlternativeSession', alternativeAuthToken))
        .then((unAuthorizedRes) => {
          expect(unAuthorizedRes).to.have.property('status').to.eq(HTTP_STATUS_CODE.NOT_FOUND);
          expect(unAuthorizedRes).to.have.property('error').to.eq('User to authorize not found!');
        });
    };

    it('should logout user from all sessions', () => {
      createAndConfirmMultipleSessions();

      cy.contains('Security').click();
      // end all sessions
      cy.get('[data-cy="button:logout-from-all-sessions"]').click();
      cy.get('[data-cy="button:confirm-logging-out-from-multiple-sessions"]').click();

      cy.location('pathname').should('eq', ROUTES.ROOT);
      cy.getFromStorage('userAuthToken').should('eq', null);
      confirmEndedAlternativeSession();
    });

    it('should logout user from other sessions', () => {
      createAndConfirmMultipleSessions();

      cy.contains('Security').click();
      // end other sessions
      cy.get('[data-cy="button:logout-from-other-sessions"]').click();
      cy.get('[data-cy="button:confirm-logging-out-from-multiple-sessions"]').click();

      cy.location('pathname').should('eq', `${ROUTES.ACCOUNT}/security`);
      cy.getFromStorage('userAuthToken').should('have.length.gte', 0);
      confirmEndedAlternativeSession();

      cy.get('[data-cy="popup:message"]')
        .as('loggedOutConfirmationPopup')
        .should('have.text', 'Logged out from other sessions!');
      cy.get('[data-cy="button:close-ended-other-sessions-confirmation"]').click();
      cy.get('@loggedOutConfirmationPopup').should('not.exist');
    });
  });
});
