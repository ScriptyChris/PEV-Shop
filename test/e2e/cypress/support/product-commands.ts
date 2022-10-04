import { Cypress, cy } from 'local-cypress';

Cypress.Commands.add('addTestProductByAPI', (productData, authToken) => {
  return cy.sendAPIReq({
    endpoint: 'products',
    method: 'POST',
    extraHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
    payload: productData,
  });
});

Cypress.Commands.add('removeTestProducts', (productName, authToken) => {
  return cy.sendAPIReq({
    endpoint: `products/${productName}`,
    method: 'DELETE',
    extraHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
    canFail: false,
  });
});
