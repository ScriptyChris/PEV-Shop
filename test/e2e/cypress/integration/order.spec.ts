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

    cy.get('[data-cy="container:product-card"]')
      .first()
      .as('productCardContainer')
      .find('[data-cy="label:product-name"], [data-cy="label:product-price"]')
      .then(([productNameElem, productPriceElem]) => {
        cy.wrap([productNameElem, productPriceElem]).as('productNameAndPriceElems');
      });

    cy.get('@productCardContainer').find('[data-cy="button:toggle-action-bar"]').click();
    cy.get('[data-cy="container:product-card__action-bar"]').as('productCardActionBar');
    cy.get('@productCardActionBar').find('[data-cy="button:add-product-to-cart"]').click();
    
    // close menu overlay
    cy.get('@productCardActionBar').closest('[role="presentation"]').children('[aria-hidden="true"]').click();

    cy.get('[data-cy="container:cart"]').as('cartContainer').should('not.exist');
    cy.get('[data-cy="button:toggle-cart"]').click();

    // not using @cartContainer alias, because Cypress sees element's stale DOM state (not existing in particular)
    // this behavior will probably be fixed https://github.com/cypress-io/cypress/issues/2971
    cy.get('[data-cy="container:cart"]').should('be.visible');

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
