import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { TE2EUser } from '@src/types';
import { ROUTES } from '@frontend/components/pages/_routes';
import * as users from '@database/populate/initial-users.json';

const exampleUser = (users as TE2EUser[])[0];

describe('order', () => {
  beforeEach(() => {
    cy.cleanupTestUsersAndEmails();
  });

  it('should make an order for a product', () => {
    /*
      START OF: add product to cart
    */

    cy.visit(ROUTES.LOG_IN);
    cy.loginTestUserByUI(exampleUser);
    cy.visit(ROUTES.SHOP);

    cy.get('[data-cy="container:product-item"]')
      .first()
      .as('productItemContainer')
      .find('[data-cy="label:product-name"], [data-cy="label:product-price"]')
      .then(([productNameElem, productPriceElem]) => {
        cy.wrap([productNameElem, productPriceElem]).as('productNameAndPriceElems');
      });

    cy.get('@productItemContainer').find('[data-cy="button:add-product-to-cart"]').click();
    cy.get('[data-cy="container:cart"]').as('cartContainer').should('not.be.visible');
    cy.get('[data-cy="button:toggle-cart"]').click();
    cy.get('@cartContainer').should('be.visible');
    cy.get('@productNameAndPriceElems').then(([productNameElem, productPriceElem]) => {
      cy.get('[data-cy="label:cart-product-name"], [data-cy="label:cart-product-price"]').then(
        ([cartProductNameElem, cartProductPriceElem]) => {
          expect(productNameElem.textContent).to.eq(cartProductNameElem.textContent);
          expect(productPriceElem.textContent).to.eq(cartProductPriceElem.textContent);
        }
      );
    });

    /*
      END OF: add product to cart
    */
  });
});
