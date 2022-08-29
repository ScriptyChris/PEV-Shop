import { cy, describe, beforeEach, it, expect } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';

describe('product-comparing', () => {
  const addProductsToCandidatesList = () => {
    const productCardSelectors = Array.from(
      { length: 4 },
      (_, index) => `[data-cy="container:product-card_${index}"]`
    ).join(',');

    // add a few products to compare
    cy.get(productCardSelectors)
      .should('have.length', 4)
      .then(($productCards) => {
        const $listOfProductLabelsAndActionBarTogglerBtns = $productCards.map((_, card) =>
          card.querySelectorAll(
            `[data-cy="label:product-card__name"],
            [data-cy="button:toggle-action-bar"]`
          )
        );

        return cy.wrap(
          $listOfProductLabelsAndActionBarTogglerBtns.map((_, elements) => {
            const [productLabel, togglerBtn] = [elements[0], elements[1]];

            cy.wrap(togglerBtn).click();
            // add product to compare
            cy.get('[data-cy="button:add-product-to-comparison"]')
              .click()
              // assert button update after removal
              .should(($btn) => expect($btn.attr('data-cy')).to.eq('button:remove-product-from-comparison'))
              // close action bar overlay
              .closest('[data-cy="popup:product-card__actions-bar"]')
              .children('[aria-hidden="true"]')
              .first()
              .click();

            return productLabel;
          })
        );
      })
      // assert if added products are correct
      .then(($productLabels) => {
        cy.get('[data-cy="counter:product-comparison-candidates__list-counter"]').should(($counter) => {
          expect(Number($counter.text())).to.equal($productLabels.length);
        });
        cy.get('[data-cy="label:product-comparison-candidates__list-item-name"]').should(
          ($productComparisonCandidatesNameEls) => {
            expect($productLabels.length).to.equal($productComparisonCandidatesNameEls.length);

            const productNamesLabels = [...$productLabels.map((_, label) => label.textContent)];
            const candidateNames = [...$productComparisonCandidatesNameEls.map((_, nameEl) => nameEl.textContent)];

            expect(productNamesLabels).to.have.ordered.members(candidateNames);
          }
        );

        return cy.wrap($productLabels.map((_, { textContent }) => textContent)).as('productLabelNames');
      });
  };

  beforeEach(() => {
    cy.visit(ROUTES.SHOP);
    cy.get('[data-cy="button:product-comparison-candidates__actions-clear"]').click({ force: true });
    cy.get('[data-cy="container:product-comparison-candidates__list"]').children().should('have.length', 0);
  });

  it('should add products to candidates list', addProductsToCandidatesList);

  it('should remove individual products from candidates list', () => {
    addProductsToCandidatesList();

    // assert current state and prepare for removal
    cy.get('[data-cy="container:product-comparison-candidates__list"]')
      .children()
      .as('candidatesListChildren')
      .should('have.length', 4);
    cy.get('[data-cy="counter:product-comparison-candidates__list-counter"]')
      .as('candidatesCounter')
      .invoke('text')
      .should('be.equal', '4');
    cy.get('[data-cy="button:product-comparison-candidates__list-item-remove-btn--0"]')
      .as('firstCandidateRemoveBtn')
      .parent()
      .find('[data-cy="label:product-comparison-candidates__list-item-name"]')
      .first()
      .as('firstCandidateNameElement')
      .invoke('text')
      .as('firstCandidateName');

    // remove by clicking inside candidates list
    cy.get('@firstCandidateRemoveBtn').click();

    // assert state after removal
    cy.get('@candidatesListChildren').should('have.length', 3);
    cy.get('@candidatesCounter').invoke('text').should('be.equal', '3');
    cy.get('@firstCandidateNameElement')
      .invoke('text')
      .then((currentFirstCandidateName) => cy.get('@firstCandidateName').should('not.eq', currentFirstCandidateName));

    //// remove by clicking on candidate action bar (from products list)
    cy.get('@firstCandidateNameElement')
      .invoke('text')
      .then((currentFirstCandidateName) => {
        // open product's action bar
        cy.get(`[data-cy="label:product-card__name"]:contains(${currentFirstCandidateName})`)
          .closest('[data-cy^="container:product-card_"]')
          .find('[data-cy="button:toggle-action-bar"]')
          .click();

        cy.get('[data-cy="button:remove-product-from-comparison"]')
          // click to remove
          .click()
          // assert button update after removal
          .should('have.attr', 'data-cy', 'button:add-product-to-comparison');
      });

    // assert state after second removal
    cy.get('@candidatesListChildren').should('have.length', 2);
    cy.get('@candidatesCounter').invoke('text').should('be.equal', '2');
  });

  it("should toggle comparing candidate product via it's details page", () => {
    // add products individually
    assertAddingProductToComparisonViaItsPage(0)
      .then(() => assertAddingProductToComparisonViaItsPage(1))
      .then(() => assertAddingProductToComparisonViaItsPage(2))
      .then(() => assertAddingProductToComparisonViaItsPage(3))
      .then(() => assertAddingProductToComparisonViaItsPage(4))
      // remove products individually
      .then(() => assertRemovingProductFromComparisonViaItsPage(4, true))
      .then(() => assertRemovingProductFromComparisonViaItsPage(3, false))
      .then(() => assertRemovingProductFromComparisonViaItsPage(2, true))
      .then(() => assertRemovingProductFromComparisonViaItsPage(1, false));

    function assertAddingProductToComparisonViaItsPage(productIndex: number) {
      // setup state
      cy.get('[data-cy="container:product-comparison-candidates__list"]').as('candidatesList');

      // go to product page
      cy.get(`[data-cy="container:product-card_${productIndex}"] [data-cy="label:product-card__name"]`)
        .closest('[data-cy="link:product-card__link"]')
        .click();

      // assert certain amount of candidates
      cy.get('@candidatesList').children().should('have.length', productIndex);

      // add product
      cy.get('[data-cy="button:add-product-to-comparison"]')
        .click()
        .should('have.attr', 'data-cy', 'button:remove-product-from-comparison');

      // assert update
      cy.get('@candidatesList')
        .children()
        .should('have.length', productIndex + 1)
        .then(($candidatesListChildren) => {
          cy.get('[data-cy="label:product-detail__name"]').contains(
            $candidatesListChildren
              .eq(productIndex)
              .find('[data-cy="label:product-comparison-candidates__list-item-name"]')
              .text()
          );
        });
      cy.get('[data-cy="counter:product-comparison-candidates__list-counter"]').contains(productIndex + 1);

      // go back to products list
      cy.get(`a[href="${ROUTES.SHOP}"]`).click();

      // let caller to chain the result
      return cy.wrap(null);
    }

    function assertRemovingProductFromComparisonViaItsPage(productIndex: number, shouldRemoveByToggler = false) {
      // go to product page
      cy.get(`[data-cy="container:product-card_${productIndex}"] [data-cy="label:product-card__name"]`)
        .closest('[data-cy="link:product-card__link"]')
        .click();

      // assert certain amount of candidates
      cy.get('@candidatesList')
        .children()
        .should('have.length', productIndex + 1);

      // prepare removal
      cy.get('[data-cy="button:remove-product-from-comparison"]').as('togglerRemoveBtn');
      cy.get(`[data-cy="button:product-comparison-candidates__list-item-remove-btn--${productIndex}"]`)
        .then(($candidateListItemRemoveBtn) => {
          cy.get('[data-cy="label:product-detail__name"]')
            .invoke('text')
            .then((productDetailName) => {
              const $candidatesListProductLabelText = $candidateListItemRemoveBtn
                .prev('[data-cy="label:product-comparison-candidates__list-item-name"]')
                .text();

              expect($candidatesListProductLabelText).to.equal(productDetailName);

              return (
                cy
                  .wrap($candidatesListProductLabelText)
                  .as('candidatesListProductLabelText')
                  // recover $removeBtn as context for futher chaining of outside `.then()`
                  .then(() => $candidateListItemRemoveBtn)
              );
            });
        })
        .as('candidateListItemRemoveBtn');

      // remove product
      if (shouldRemoveByToggler) {
        cy.get('@togglerRemoveBtn').click();
      } else {
        cy.get('@candidateListItemRemoveBtn').click();
      }

      // assert update
      cy.get('@togglerRemoveBtn').should('have.attr', 'data-cy', 'button:add-product-to-comparison');
      cy.get('@candidatesList')
        .children()
        .should('have.length', productIndex)
        .then(($candidatesListElements) => {
          cy.get('@candidatesListProductLabelText').then((candidatesListProductLabelText) => {
            // assert candidates list doesn't have removed product
            expect($candidatesListElements.find(`:contains(${candidatesListProductLabelText})`)).to.have.lengthOf(0);
          });
        });
      cy.get('[data-cy="counter:product-comparison-candidates__list-counter"]').contains(productIndex);

      if (!shouldRemoveByToggler) {
        cy.get('[data-cy="button:add-product-to-comparison"]').should('exist');
      }

      // go back to products list
      cy.get(`a[href="${ROUTES.SHOP}"]`).click();
    }
  });

  it('should show warning when user tries to compare less than two products', () => {
    // assert popup does not exist
    cy.get('[data-cy="popup:message"]').should('not.exist');

    // add first comparison candidate
    cy.get('[data-cy="button:toggle-action-bar"]').first().click();
    cy.get('[data-cy="button:add-product-to-comparison"]').click();
    cy.get('[data-cy="popup:product-card__actions-bar"]').children('[aria-hidden="true"]').click();

    // trigger warning popup
    cy.get('[data-cy="link:product-comparison-candidates__actions-proceed"]').click();
    cy.contains('[data-cy="popup:message"]', 'At least 2 products needs to be selected to do a comparison.');
    cy.get('[data-cy="button:popup-close"]').click();

    // add second comparison candidate
    cy.get('[data-cy="button:toggle-action-bar"]').eq(2).click();
    cy.get('[data-cy="button:add-product-to-comparison"]').click();
    cy.get('[data-cy="popup:product-card__actions-bar"]').children('[aria-hidden="true"]').click();

    // assert warning popup doesn't show up
    cy.get('[data-cy="link:product-comparison-candidates__actions-proceed"]').click();
    cy.get('[data-cy="popup:message"]').should('not.exist');
    cy.location('pathname').should('eq', ROUTES.COMPARE);

    // go to third product's page
    cy.get(`a[href="${ROUTES.SHOP}"]`).click();
    cy.get('[data-cy="label:product-card__name"]').eq(3).closest('[data-cy="link:product-card__link"]').click();

    // cleanup comparison candidates list
    cy.get('[data-cy="button:product-comparison-candidates__actions-clear"]').click();

    // add third product as a single comparison candidates
    cy.get('[data-cy="container:product-comparison-candidates__list"]')
      .as('comparisonCandidatesList')
      .children()
      .should('not.exist');
    cy.get('[data-cy="button:add-product-to-comparison"]').click();
    cy.get('@comparisonCandidatesList').children().should('have.length', 1);

    // assert warning popup doesn't show up again
    cy.get('[data-cy="popup:message"]').should('not.exist');
    cy.get('[data-cy="link:product-comparison-candidates__actions-proceed"]').click();
    cy.contains('[data-cy="popup:message"]', 'At least 2 products needs to be selected to do a comparison.');
    cy.get('[data-cy="button:popup-close"]').click();
  });

  it('should redirect to comparison page with candidated products listed', () => {
    addProductsToCandidatesList();

    // confirm the comparison and redirect to it's page
    cy.get('[data-cy="link:product-comparison-candidates__actions-proceed"]').click();

    // assertions
    cy.location('pathname').should('eq', ROUTES.COMPARE);
    cy.contains('[data-cy="label:product-comparison__header-counter"]', '4');
    cy.get('[data-cy="label:product-detail__name"]').then(($comparedProductsNameElements) => {
      const $comparedProductNames = $comparedProductsNameElements.map((_, { textContent }) => textContent);

      cy.get('@productLabelNames').then(($productLabelNames) =>
        expect([...$productLabelNames]).to.have.ordered.members([...$comparedProductNames])
      );
    });
  });
});
