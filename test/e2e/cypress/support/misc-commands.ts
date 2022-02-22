import { cy, Cypress } from 'local-cypress';

Cypress.Commands.add('getFromStorage', (key) => {
  return cy.window().then((window) => JSON.parse(window.localStorage.getItem(key) as string));
});
