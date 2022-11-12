import { describe, it, cy, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { makeCyDataSelector } from '../synchronous-helpers';
import { HTTP_STATUS_CODE } from '@src/types';

function assertProductsFilterQueryParam(url: string, objectToAssertInclusion: { [key: string]: string }) {
  const productsFilterQueryParams = Object.fromEntries(
    new URLSearchParams(url)
      .get('productsFilters')!
      .split(',')
      .map((queryParam) => queryParam.split(':'))
  );

  return expect(productsFilterQueryParams).to.include(objectToAssertInclusion);
}

describe('product-filters', () => {
  it('should find products regarding applied filters', () => {
    // prepare
    cy.visit(ROUTES.PRODUCTS);
    cy.get(makeCyDataSelector('container:products-filter'))
      .children()
      .as('productsFiltersContainer')
      .its('length')
      .as('productsFiltersInitialAmount');

    let productsFilterToCheck: string;
    cy.intercept(/\/api\/products\?.*?productsFilters=.*/, (req) => {
      expect(productsFilterToCheck).to.be.a('string').that.is.not.empty;

      req.alias = productsFilterToCheck;
      req.continue((res) => {
        expect(res.statusCode).to.be.oneOf([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.NOT_MODIFIED]);
      });
    });

    // change products category
    cy.get(makeCyDataSelector('list:categories_names')).children(':contains("Electric Scooters & eBikes")').click();
    cy.get('@productsFiltersInitialAmount').then((productsFiltersAmount) => {
      cy.get('@productsFiltersContainer').children().should('have.length.lessThan', productsFiltersAmount);
    });

    // apply color filter
    cy.get(makeCyDataSelector('button:product-filter__colour')).click();
    cy.get(`${makeCyDataSelector('container:products-filter')} input[id="colour__red"]`).click();

    // assert "color" filter
    productsFilterToCheck = 'colour';
    cy.wait('@colour')
      .then((interception) => assertProductsFilterQueryParam(interception.request.url, { colour: 'red' }))
      .then(() => (productsFilterToCheck = 'weight--min'));
    cy.get(makeCyDataSelector('list:product-list'))
      .should(($productList) => {
        const filteredProductNames = [
          ...$productList.find(makeCyDataSelector('label:product-card__name')).map((_, { textContent }) => textContent),
        ];
        expect(filteredProductNames).to.have.ordered.members([
          'GW Monster: Pair of Shells',
          'KS 14B: 174Wh Battery Pack',
          'Protective Padding/Bumper Strip',
          '18L/XL Bodyguard Protective Neoprene Covers Roll.nz',
        ]);
      })
      .as('filteredProductList')
      .children()
      .should('have.length', 4);

    // change minimum weight value filter
    cy.get(makeCyDataSelector('button:product-filter__weight')).click();
    cy.get(`${makeCyDataSelector('container:products-filter')} input[id="weight--min"]`).type('1');

    // assert "weight" filter
    cy.wait('@weight--min').then((interception) =>
      assertProductsFilterQueryParam(interception.request.url, { 'weight--min': '1' })
    );
    cy.get('@filteredProductList').should(($productList) => {
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
