import { describe, it, cy, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { makeCyDataSelector } from '../synchronous-helpers';
import { HTTP_STATUS_CODE } from '@root/src/types';

describe('product-filters', () => {
  it('should find products regarding applied filters', () => {
    // prepare
    cy.visit(ROUTES.SHOP);
    cy.get(makeCyDataSelector('container:products-filter'))
      .children()
      .as('productsFiltersContainer')
      .its('length')
      .as('productsFiltersInitialAmount');

    // change products category
    cy.get(makeCyDataSelector('list:categories_names')).children(':contains("Electric Scooters & eBikes")').click();
    cy.get('@productsFiltersInitialAmount').then((productsFiltersAmount) => {
      cy.get('@productsFiltersContainer').children().should('have.length.lessThan', productsFiltersAmount);
    });

    // apply color filter
    cy.get(makeCyDataSelector('button:product-filter__colour')).click();
    cy.intercept('/api/products*', (req) => {
      expect(req.url).to.contain('productsFilters=');
      req.continue((res) => {
        expect(res.statusCode).to.eq(HTTP_STATUS_CODE.OK);
      });
    }).as('productsFilterReq');
    cy.get(`${makeCyDataSelector('container:products-filter')} input[id="colour__red"]`).click();

    // assert "color" filter works
    cy.wait('@productsFilterReq');
    cy.get(makeCyDataSelector('list:product-list')).as('filteredProductList').children().should('have.length', 4);
    cy.get('@filteredProductList').then(($productList) => {
      const filteredProductNames = [
        ...$productList.find(makeCyDataSelector('label:product-card__name')).map((_, { textContent }) => textContent),
      ];
      expect(filteredProductNames).to.have.ordered.members([
        'GW Monster: Pair of Shells',
        'KS 14B: 174Wh Battery Pack',
        'Protective Padding/Bumper Strip',
        '18L/XL Bodyguard Protective Neoprene Covers Roll.nz',
      ]);
    });

    // change minimum weight value filter to 1
    cy.get(makeCyDataSelector('button:product-filter__weight')).click();
    cy.intercept('/api/products*', (req) => {
      expect(req.url).to.contain('productsFilters=');
      req.continue((res) => {
        expect(res.statusCode).to.eq(HTTP_STATUS_CODE.OK);
      });
    }).as('productsFilterReq');
    cy.get(`${makeCyDataSelector('container:products-filter')} input[id="weight--min"]`).type('1');

    // assert "weight" filter works
    cy.wait('@productsFilterReq');
    cy.get('@filteredProductList').then(($productList) => {
      const filteredProductNames = [
        ...$productList.find(makeCyDataSelector('label:product-card__name')).map((_, { textContent }) => textContent),
      ];
      expect(filteredProductNames).to.have.ordered.members([
        'GW Monster: Pair of Shells',
        'Protective Padding/Bumper Strip',
        '18L/XL Bodyguard Protective Neoprene Covers Roll.nz',
      ]);
    });
  });
});
