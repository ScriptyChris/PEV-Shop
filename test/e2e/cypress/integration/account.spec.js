import { cy, it, describe, beforeEach } from 'local-cypress';
import { ROUTES } from '@srcForE2E/frontend/components/pages/_routes';
const ACCOUNT_TEST_USER = Object.freeze({
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
        cy.getFromStorage('userAccount').then((user) => {
            const profileDetails = [
                { header: 'login', data: user.login },
                { header: 'email', data: user.email },
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
});
