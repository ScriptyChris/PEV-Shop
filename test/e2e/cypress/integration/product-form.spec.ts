import { describe, it, cy } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { makeCyDataSelector } from '../synchronous-helpers';

describe('modify existing product', () => {
  const productData = Object.freeze(getKingSong14sData());

  it('form should contain proper data', () => {
    // go to product modification page
    cy.visit(ROUTES.SHOP);
    cy.get(makeCyDataSelector('input:the-search')).type(productData.name);
    cy.contains(makeCyDataSelector('label:product-card__name'), productData.name)
      .closest(makeCyDataSelector('link:product-card__link'))
      .click();
    cy.get(makeCyDataSelector('button:product-details__edit-product')).click();

    // assert correct content
    cy.get(makeCyDataSelector('input:base__name')).should('have.value', productData.name);
    cy.get(makeCyDataSelector('input:base__price')).should('have.value', productData.price);
    cy.get(makeCyDataSelector('input:base__price')).should('have.value', productData.price);
    cy.wrap(productData.descriptions).then((descs) => {
      cy.wrap(
        descs.map((desc, index) => cy.contains(makeCyDataSelector(`label:product-descriptions__${index}`), desc))
      );
    });
    cy.get(makeCyDataSelector('input:category_names')).should('have.value', productData.categories.join(', '));
    cy.wrap(productData.specs).then((specs) => {
      cy.wrap(
        Object.entries(specs).map(([specName, specValue]) =>
          cy.get(makeCyDataSelector(`input:spec__${specName}`)).should('have.value', specValue)
        )
      );
    });
    cy.wrap(productData.relatedProductNames).then((relatedProductNames) => {
      cy.wrap(
        relatedProductNames.map((relatedProductName, index) =>
          cy.contains(makeCyDataSelector(`label:related-product-names__${index}`), relatedProductName)
        )
      );
    });
  });
});

function getKingSong14sData() {
  return {
    name: 'King Song 14S, 840Wh Battery/800W Motor',
    price: 1175,
    descriptions: [
      'Back in Stock, shipping now',
      'BONUS: a pair of FREE wrist-guards included',
      'The KS14S has nearly the same practicality & nimbleness of the KS14D, but with the added benefit of the larger battery that provides both longer range & higher continuous cruising speed over its smaller 14D sibling',
    ],
    categories: ['Advanced Electric Wheels'],
    specs: {
      weight: 34,
      battery_capacity: 720,
      top_speed: 18.6,
      range: 35,
      max_load: 220,
      motor_power: '',
      charge_time: 1.75,
    },
    relatedProductNames: [
      'NEW: MTen3 10”, ‘The Pocket Rocket’, 512Wh/800W Motor',
      'NEW: King Song 18XL 1554Wh Battery/2000W Motor',
      'NEW: King Song 16X 1554Wh Battery/2000W Motor, 3″ Wide Tire',
      'King Song 16S, 1200W Motor/840Wh Battery',
    ],
  };
}
