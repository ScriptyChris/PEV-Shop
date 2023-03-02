import { cy, Cypress } from 'local-cypress';

Cypress.Commands.add('makeOrder', (orderData, authToken) => {
  return cy.sendAPIReq({
    endpoint: 'orders',
    method: 'POST',
    payload: orderData,
    extraHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
});

Cypress.Commands.add('removeOrders', () => {
  return cy.sendAPIReq({
    endpoint: 'orders',
    method: 'DELETE',
  });
});
