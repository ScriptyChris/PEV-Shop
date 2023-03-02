import { cy, Cypress, it, describe, context, beforeEach, expect, after } from 'local-cypress';
import type { TUserPublic } from '@database/models';
import { ROUTES } from '@frontend/components/pages/_routes';
import { HTTP_STATUS_CODE, TE2EUser } from '@commons/types';
import { makeCyDataSelector } from '../synchronous-helpers';

const ACCOUNT_TEST_USER: TE2EUser = Object.freeze({
  login: 'account test user',
  password: 'password',
  email: 'account_test_user@example.org',
  accountType: 'client',
});

describe('#account', () => {
  const goToNewUserAccount = () => {
    cy.registerAndLoginTestUser(ACCOUNT_TEST_USER);

    // TODO: [UI/AUTH] check why direct navigation to the URL (via address bar) after user has been logged in returns 401
    cy.get(`a[href="${ROUTES.ACCOUNT}"]`).click();
  };

  beforeEach(() => {
    cy.cleanupTestUsersAndEmails();
  });

  it('should give access to listed user account features', () => {
    goToNewUserAccount();

    [
      { name: 'Profile', url: ROUTES.ACCOUNT__USER_PROFILE, dataCySection: 'section:user-profile' },
      { name: 'Security', url: ROUTES.ACCOUNT__SECURITY, dataCySection: 'section:security' },
      {
        name: 'Observed products',
        url: ROUTES.ACCOUNT__OBSERVED_PRODUCTS,
        dataCySection: 'section:observed-products',
      },
      { name: 'Orders', url: ROUTES.ACCOUNT__ORDERS, dataCySection: 'section:orders' },
    ].forEach(({ name, url, dataCySection }) => {
      cy.get(makeCyDataSelector('link:account-feature')).contains(name).and('have.attr', 'href', url).click();
      cy.location('pathname').should('eq', url);
      cy.get(makeCyDataSelector(`${dataCySection}`)).should('be.visible');
    });
  });

  it('should show profile details', () => {
    goToNewUserAccount();

    cy.get(`${makeCyDataSelector('link:account-feature')}[href="${ROUTES.ACCOUNT__USER_PROFILE}"]`).click();
    cy.getFromStorage<TUserPublic>('userAccount').then((user) => {
      const profileDetails = [
        { header: 'login', data: user.login },
        { header: 'email', data: user.email },
        // TODO: [UI] add this check when UI will render it as a list instead array
        // { header: 'observedProductsIDs', data: user.observedProductsIDs },
      ];
      cy.get(`${makeCyDataSelector('section:user-profile')} tr`).each(($tr, index) => {
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
      cy.get(makeCyDataSelector('button:logout-from-all-sessions')).click();
      cy.get(makeCyDataSelector('button:confirm-logging-out-from-multiple-sessions')).click();

      cy.location('pathname').should('eq', ROUTES.ROOT);
      cy.getFromStorage('userAuthToken').should('eq', null);
      confirmEndedAlternativeSession();
    });

    it('should logout user from other sessions', () => {
      createAndConfirmMultipleSessions();

      cy.contains('Security').click();
      // end other sessions
      cy.get(makeCyDataSelector('button:logout-from-other-sessions')).click();
      cy.get(makeCyDataSelector('button:confirm-logging-out-from-multiple-sessions')).click();

      cy.location('pathname').should('eq', ROUTES.ACCOUNT__SECURITY);
      cy.getFromStorage('userAuthToken').should('have.length.gte', 0);
      confirmEndedAlternativeSession();

      cy.get(makeCyDataSelector('popup:message'))
        .as('loggedOutConfirmationPopup')
        .should('have.text', 'Logged out from other sessions!');
      cy.get(makeCyDataSelector('button:close-ended-other-sessions-confirmation')).click();
      cy.get('@loggedOutConfirmationPopup').should('not.exist');
    });
  });

  context('orders', () => {
    beforeEach(() => {
      cy.removeOrders();
    });

    after(() => {
      cy.removeOrders();
    });

    it('should show current client user orders', () => {
      let clientUserAuthToken = '';

      // assert no orders were made yet
      cy.registerAndLoginTestUser(ACCOUNT_TEST_USER);
      cy.getFromStorage('userAuthToken').then((authToken) => (clientUserAuthToken = authToken));
      cy.visit(ROUTES.ACCOUNT__ORDERS);
      cy.contains(makeCyDataSelector('section:orders'), 'No orders made yet!');

      // create some orders
      cy.getProducts()
        .then((productsResponse) => {
          const firstProductId = productsResponse.body.payload[0]._id;

          return cy.makeOrder(
            {
              receiver: {
                name: 'Test client name',
                email: 'test-client@example.org',
                phone: '123456789',
              },
              shipment: {
                method: 'inPerson',
                address: 'PEV Shop,ul. Testable 1,12-345 Testland',
              },
              payment: {
                method: 'cash',
              },
              products: [
                {
                  id: firstProductId,
                  quantity: 1,
                },
              ],
            },
            clientUserAuthToken
          );
        })
        .then((madeOrderResponse) => {
          expect(madeOrderResponse.body.payload).to.haveOwnProperty('orderTimestamp');

          return madeOrderResponse.body.payload.orderTimestamp;
        })
        // assert correct order data
        .then((orderTimestamp) => {
          cy.reload();

          cy.contains(
            makeCyDataSelector('label:order__summary-date'),
            new Date(orderTimestamp).toLocaleString()
          ).click();
          cy.get(makeCyDataSelector('label:order__receiver-name'))
            .should('have.text', 'Name')
            .next()
            .should('have.text', 'Test client name');
          cy.get(makeCyDataSelector('label:order__receiver-email'))
            .should('have.text', 'Email')
            .next()
            .should('have.text', 'test-client@example.org');
          cy.get(makeCyDataSelector('label:order__receiver-phone'))
            .should('have.text', 'Phone number')
            .next()
            .should('have.text', '123456789');
          cy.contains(makeCyDataSelector('label:order__in-person-shipment'), 'PEV Shopul. Testable 112-345 Testland');
          cy.contains(makeCyDataSelector('label:order__payment'), 'Cash');
        });
    });

    // TODO: [E2E] add test
    // it('should show all client users orders', () => {})
  });
});
