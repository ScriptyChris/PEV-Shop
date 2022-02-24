import { cy, Cypress } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';

Cypress.Commands.add('getFromStorage', (key) => {
  return cy.window().then((window) => JSON.parse(window.localStorage.getItem(key) as string));
});

Cypress.Commands.add('cleanupTestUsersAndEmails', () => {
  cy.visit(ROUTES.ROOT);
  cy.deleteEmails().as('deleteEmails');
  cy.removeTestUsers().as('removeTestUsers');
  cy.get('@deleteEmails');
  cy.get('@removeTestUsers');
});
