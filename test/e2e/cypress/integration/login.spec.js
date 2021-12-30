import { ROUTES } from '../fixtures/_routes.js';

describe('#login', () => {
    it('should visit login page', () => {
        cy.visit(ROUTES.LOG_IN);
        cy.wait(1500);
    })
})