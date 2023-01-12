import { describe, it, cy, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { makeCyDataSelector } from '../synchronous-helpers';
import { HTTP_STATUS_CODE } from '@commons/types';

function assertSearchParamsCount(expectedCount: number) {
  cy.location('search').should((search) => {
    const usp = new URLSearchParams(search);
    // @ts-ignore
    const searchParamsKeysLength = [...usp.keys()].length;

    expect(searchParamsKeysLength).eq(expectedCount);
  });
}

describe('product-filters', () => {
  it('should find products regarding applied filters', () => {
    // prepare
    cy.visit(ROUTES.PRODUCTS);
    cy.get(makeCyDataSelector('container:products-spec-chooser'))
      .children()
      .as('productTechnicalSpecsContainer')
      .its('length')
      .as('productTechnicalSpecsAmount');

    const activatedFilterNames = ['productCategories', 'productPrice', 'productTechnicalSpecs', 'sortBy'];
    // eslint-disable-next-line
    const activatedFiltersRegex = new RegExp(`\/api\/products\?.*?(${activatedFilterNames.join('|')})([])?=`, 'g');

    assertSearchParamsCount(2);

    cy.intercept(activatedFiltersRegex, (req) => {
      expect(activatedFilterNames.every((name) => req.url.includes(name))).to.be.true;
      req.continue((res) => {
        expect(res.statusCode).to.be.oneOf([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.NOT_MODIFIED]);
      });
    });

    // choose products category
    cy.get(makeCyDataSelector('list:categories_names')).children(':contains("Accessories")').click();
    cy.get('@productTechnicalSpecsAmount').then((productTechnicalSpecsAmount) => {
      cy.get('@productTechnicalSpecsContainer').children().should('have.length.lessThan', productTechnicalSpecsAmount);
    });

    // fill `price` filter
    cy.get(makeCyDataSelector('input:price-max-filter')).type('20');

    // fill `dimensions__length--min` filter
    cy.get(makeCyDataSelector('button:product-spec-dimensions')).click();
    cy.get(`${makeCyDataSelector('container:products-spec-chooser')} input[id="dimensions__length--min"]`).type('10');

    // apply filters
    cy.get(makeCyDataSelector('button:apply-filters')).click();

    // assert filtered products are listed
    cy.get(makeCyDataSelector('list:products-dashboard__list'))
      .should(($productList) => {
        const filteredProductNames = [
          ...$productList.find(makeCyDataSelector('label:product-card__name')).map((_, { textContent }) => textContent),
        ];
        expect(filteredProductNames).to.have.ordered.members([
          '12” x 9” Piece of Jessup Skate Grip Tape',
          'Inner-Tube: 14” x 2.125”, Kenda',
          'eWheels Branded Wrist-guards',
        ]);
      })
      .as('filteredProductList')
      .children()
      .should('have.length', 3);

    assertSearchParamsCount(5);

    // sort by price ascending
    cy.get(makeCyDataSelector('button:trigger-sorting-select')).click();
    cy.get(makeCyDataSelector('option:sort-by-priceAsc')).click();

    // assert filtered products are sorted
    cy.get('@filteredProductList').should(($productList) => {
      const filteredProductNames = [
        ...$productList.find(makeCyDataSelector('label:product-card__name')).map((_, { textContent }) => textContent),
      ];
      expect(filteredProductNames).to.have.ordered.members([
        '12” x 9” Piece of Jessup Skate Grip Tape',
        'eWheels Branded Wrist-guards',
        'Inner-Tube: 14” x 2.125”, Kenda',
      ]);
    });

    assertSearchParamsCount(6);

    // reset filters
    cy.get(makeCyDataSelector('button:clear-filters')).click();

    assertSearchParamsCount(2);
  });
});
