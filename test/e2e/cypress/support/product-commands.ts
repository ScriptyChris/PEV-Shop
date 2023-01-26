import { Cypress, cy } from 'local-cypress';

Cypress.Commands.add('addTestProductByAPI', (productData, authToken) => {
  const { images, ...plainData } = productData;
  const payloadEntries = [
    ['plainData', JSON.stringify(plainData)],
    ...images.map((img, index) => [`image${index}`, img]),
  ];

  return cy.sendAPIReq({
    endpoint: 'products',
    method: 'POST',
    extraHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
    payload: payloadEntries,
    shouldBeForm: true,
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
