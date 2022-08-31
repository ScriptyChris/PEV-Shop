import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { TE2EUser } from '@src/types';
import { ROUTES } from '@frontend/components/pages/_routes';
import { makeCyDataSelector } from '../synchronous-helpers';
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

    cy.get(makeCyDataSelector('container:product-card_0'))
      .first()
      .as('productCardContainer')
      .find(`${makeCyDataSelector('label:product-card__name')}, ${makeCyDataSelector('label:product-price')}`)
      .then(([productNameElem, productPriceElem]) => {
        cy.wrap([productNameElem, productPriceElem]).as('productNameAndPriceElems');
      });

    cy.get('@productCardContainer').find(makeCyDataSelector('button:toggle-action-bar')).click();
    cy.get(makeCyDataSelector('container:product-card__actions-bar')).as('productCardActionBar');
    cy.get('@productCardActionBar').find(makeCyDataSelector('button:add-product-to-cart')).click();

    // close menu overlay
    cy.get('@productCardActionBar').closest('[role="presentation"]').children('[aria-hidden="true"]').click();

    cy.get(makeCyDataSelector('container:cart')).as('cartContainer').should('not.exist');
    cy.get(makeCyDataSelector('button:toggle-cart')).click();

    // not using @cartContainer alias, because Cypress sees element's stale DOM state (not existing in particular)
    // this behavior will probably be fixed https://github.com/cypress-io/cypress/issues/2971
    cy.get(makeCyDataSelector('container:cart')).should('be.visible');

    cy.get('@productNameAndPriceElems').then(([productNameElem, productPriceElem]) => {
      cy.get(
        `${makeCyDataSelector('label:cart-product-name')}, ${makeCyDataSelector('label:cart-product-price')}`
      ).then(([cartProductNameElem, cartProductPriceElem]) => {
        expect(productNameElem.textContent).to.eq(cartProductNameElem.textContent);
        expect(productPriceElem.textContent).to.eq(cartProductPriceElem.textContent);
      });
    });

    /*
      END OF: add product to cart
    */
  });
});
