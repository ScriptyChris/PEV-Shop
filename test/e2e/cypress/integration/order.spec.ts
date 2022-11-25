import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { TE2EUser, HTTP_STATUS_CODE } from '@src/types';
import { ROUTES } from '@frontend/components/pages/_routes';
import { makeCyDataSelector } from '../synchronous-helpers';
import * as users from '@database/populate/initialData/users.json';

const exampleUser = (users as TE2EUser[])[0];
const testReceiver = {
  name: 'Somebody Random',
  email: exampleUser.email,
  phone: '123456789',
  street: 'ul. Testowa 1/2',
  postalCode: '12-345',
  city: 'Testowo',
};

const shipmentMethods = ['inPerson', 'home', 'parcelLocker'] as const;
function checkDifferentShipmentMethods(shipmentMethod: typeof shipmentMethods[number]) {
  cy.get(makeCyDataSelector(`button:choose-${shipmentMethod}-tab`)).click();
  cy.get(makeCyDataSelector('button:submit-order')).click();
  cy.wait(`@${shipmentMethod}`).then((interception) =>
    expect(interception.request.body.shipmentMethod).to.eq(shipmentMethod)
  );
  cy.contains(makeCyDataSelector('popup:message'), 'Sorry, but an unexpected error occured :(');
  cy.get(makeCyDataSelector('button:popup-close')).click();
}

const paymentMethods = ['cash', 'card', 'transfer', 'blik'] as const;
function checkDifferentPaymentMethods(paymentMethod: typeof paymentMethods[number]) {
  cy.get(makeCyDataSelector(`input:choose-${paymentMethod}-payment`)).check();
  cy.get(makeCyDataSelector('button:submit-order')).click();
  cy.wait(`@${paymentMethod}`).then((interception) =>
    expect(interception.request.body.paymentMethod).to.eq(paymentMethod)
  );
  cy.contains(makeCyDataSelector('popup:message'), 'Sorry, but an unexpected error occured :(');
  cy.get(makeCyDataSelector('button:popup-close')).click();
}

type TParcelLocation = [string, string];

const parcelMapIframeTimeoutOptionCfg = { timeout: 10000 };

const executeAfterFewSecs = (cb: () => void) => setTimeout(cb, 2000);
const chooseParcelLockerInsideIframe = async ({
  $iframeContents,
  liNthOfType,
  resolve,
  preObserverCb,
}: {
  $iframeContents: ReturnType<JQuery['contents']>;
  liNthOfType: number;
  resolve: (parcelLockerLocation: TParcelLocation) => void;
  preObserverCb?: () => void;
}) => {
  let clickedOnParcelLocker = false;
  let parcelLockerLocation: TParcelLocation;

  const mo = new MutationObserver(async () => {
    if (!clickedOnParcelLocker) {
      const $nthParcelListItem = $iframeContents.find(`#point-list > li:nth-of-type(${liNthOfType})`);

      if ($nthParcelListItem.length) {
        const $parcelLockerLocation = $nthParcelListItem.find('.title, .address');
        expect($parcelLockerLocation).to.have.lengthOf(2);

        const $parcelLockerLink = $nthParcelListItem.find('a');
        expect($parcelLockerLink).to.have.lengthOf(1);

        parcelLockerLocation = [...$parcelLockerLocation].map(({ textContent }) =>
          textContent!.trim()
        ) as TParcelLocation;
        await executeAfterFewSecs(() => {
          clickedOnParcelLocker = true;
          // click on chosen parcel locker from list
          ($parcelLockerLink[0] as HTMLAnchorElement).click();
        });
      }
    } else {
      const $parcelLockerChooserLink = $iframeContents.find('a.select-link');

      if ($parcelLockerChooserLink.length) {
        mo.disconnect();
        await executeAfterFewSecs(() => {
          // actually choose that parcel locker from it's info dialog
          ($parcelLockerChooserLink[0] as HTMLAnchorElement).click();
          resolve(parcelLockerLocation);
        });
      }
    }
  });

  if (preObserverCb) {
    await executeAfterFewSecs(preObserverCb);
  }

  mo.observe($iframeContents[0], { childList: true, subtree: true });
};

const assertParcelLockerLocation = ([parcelLockerLocationName, parcelLockerLocationAddress]: TParcelLocation) => {
  cy.get('@parcelLockerMapInsideIframe').should('exist').and('not.be.visible');
  cy.get(makeCyDataSelector('output:parcel-locker-name'))
    .invoke('text')
    .should((parcelLockerName) => {
      // expect to end with
      expect(parcelLockerLocationName).to.match(new RegExp(`${parcelLockerName}$`));
    });
  cy.get(makeCyDataSelector('output:parcel-locker-address'))
    .invoke('text')
    .should((parcelLockerAddress) => {
      // expect to start with
      expect(parcelLockerAddress).to.match(new RegExp(`^${parcelLockerLocationAddress}`));
    });
};

describe('order', () => {
  beforeEach(() => {
    cy.cleanupTestUsersAndEmails();
    cy.cleanupCartState();
  });

  const addProductToCart = () => {
    // add product to cart
    cy.visit(ROUTES.LOG_IN);
    cy.loginTestUserByUI(exampleUser);
    cy.visit(ROUTES.PRODUCTS);

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

    /*
      not using @cartContainer alias, because Cypress sees element's stale DOM state (not existing in particular)
      this behavior will probably be fixed https://github.com/cypress-io/cypress/issues/2971
    */
    cy.get(makeCyDataSelector('container:cart')).should('be.visible');

    cy.get('@productNameAndPriceElems').then(([productNameElem, productPriceElem]) => {
      cy.get(
        `${makeCyDataSelector('label:cart-product-name')}, ${makeCyDataSelector('label:cart-product-price')}`
      ).then(([cartProductNameElem, cartProductPriceElem]) => {
        expect(productNameElem.textContent).to.eq(cartProductNameElem.textContent);
        expect(productPriceElem.textContent).to.eq(cartProductPriceElem.textContent);
        cy.wrap(cartProductNameElem.textContent).as('cartProductName');
      });
    });
  };

  it('should add product to cart', addProductToCart);

  it('should make an order', () => {
    addProductToCart();

    // go to order page
    cy.get(makeCyDataSelector('button:submit-cart')).click();
    cy.location('pathname').should('eq', ROUTES.PRODUCTS__ORDER);

    // assert form is empty
    cy.get(makeCyDataSelector('input:receiver-name')).as('nameInput').should('have.value', '');
    cy.get(makeCyDataSelector('input:receiver-email')).as('emailInput').should('have.value', '');
    cy.get(makeCyDataSelector('input:receiver-phone')).as('phoneInput').should('have.value', '');
    cy.get('[data-cy="container:order-shipment"] [data-cy^="button:choose-"][data-cy$="-tab"]')
      .its('length')
      .as('paymentTabChoosersAmount');
    cy.get(
      '[data-cy="container:order-shipment"] [data-cy^="button:choose-"][data-cy$="-tab"][aria-selected="false"]'
    ).then(($unSelectedPaymentTabChoosers) => {
      cy.get('@paymentTabChoosersAmount').should('eq', $unSelectedPaymentTabChoosers.length);
    });
    cy.get('[data-cy^="input:choose-"][data-cy$="-payment"]').its('length').as('shipmentChoosersAmount');
    cy.get('[data-cy^="input:choose-"][data-cy$="-payment"]:not(:checked)').then(($nonCheckedShipmentChoosers) => {
      cy.get('@shipmentChoosersAmount').should('eq', $nonCheckedShipmentChoosers.length);
    });

    // fill order form
    cy.get('@nameInput').type(testReceiver.name);
    cy.get('@emailInput').type(testReceiver.email);
    cy.get('@phoneInput').type(testReceiver.phone);
    cy.get(makeCyDataSelector('button:choose-inPerson-tab'))
      .click()
      .should(($btn) => expect($btn.attr('aria-selected')).to.eq('true'));
    cy.get(makeCyDataSelector('input:choose-card-payment'))
      .check()
      .should(($input) => expect($input.prop('checked')).to.be.true);

    let productIdInCart: string;
    cy.get('@cartProductName').then((cartProductName) => {
      cy.findProductByNameInCartStore(cartProductName as unknown as string).then(
        (product) => (productIdInCart = product._id)
      );
    });

    // send order data
    cy.intercept('/api/orders', (req) => {
      expect(req.body).to.deep.equal({
        receiver: {
          baseInfo: {
            name: testReceiver.name,
            email: testReceiver.email,
            phone: testReceiver.phone,
          },
          address: 'PEV Shop,ul. Testowa 1,12-345 Testolandia',
        },
        shipmentMethod: 'inPerson',
        paymentMethod: 'card',
        products: [
          {
            name: '12” x 9” Piece of Jessup Skate Grip Tape',
            price: 15,
            _id: productIdInCart,
            count: 1,
          },
        ],
        price: {
          shipment: 0,
          total: 15,
        },
      });

      // TODO: do not stub response when backend will be adjusted to handle extended order form
      req.reply({
        // NON_AUTHORITATIVE_INFORMATION
        statusCode: 203,
        body: {
          payload: {
            redirectUri: ROUTES.ROOT,
          },
        },
      });
    }).as('orderRequest');
    cy.get(makeCyDataSelector('button:submit-order')).click();
    cy.wait('@orderRequest');
    cy.location('pathname').should('eq', ROUTES.ROOT);
  });

  it('should offer multiple shipment and payment methods', () => {
    addProductToCart();

    // go to order page
    cy.get(makeCyDataSelector('button:submit-cart')).click();
    cy.location('pathname').should('eq', ROUTES.PRODUCTS__ORDER);

    // fill basic form data
    cy.get(makeCyDataSelector('input:receiver-name')).type(testReceiver.name);
    cy.get(makeCyDataSelector('input:receiver-email')).type(testReceiver.email);
    cy.get(makeCyDataSelector('input:receiver-phone')).type(testReceiver.phone);

    // check different shipment methods
    {
      cy.get(makeCyDataSelector('container:shipment-tab-panel__inPerson'))
        .as('shipmentInPersonContainer')
        .should('be.hidden')
        .and('not.contain', 'Pick up your purchase personally at our store');
      cy.get(makeCyDataSelector('button:choose-inPerson-tab')).click();
      cy.get('@shipmentInPersonContainer')
        .should('be.visible')
        .and('contain', 'Pick up your purchase personally at our store');

      cy.get(makeCyDataSelector('container:shipment-tab-panel__home'))
        .as('shipmentHomeContainer')
        .should('be.hidden')
        .and('not.contain', 'Fill address information');
      cy.get(makeCyDataSelector('button:choose-home-tab')).click();
      cy.get('@shipmentHomeContainer').should('be.visible').and('contain', 'Fill address information');
      cy.get(makeCyDataSelector('input:receiver-address1')).type(testReceiver.street);
      cy.get(makeCyDataSelector('input:receiver-address2')).type(testReceiver.postalCode);
      cy.get(makeCyDataSelector('input:receiver-address3')).type(testReceiver.city);

      cy.get(makeCyDataSelector('container:shipment-tab-panel__parcelLocker'))
        .as('shipmentParcelLockerContainer')
        .should('be.hidden')
        .find(makeCyDataSelector('button:shipment__parcelLocker-location-selector'))
        .should('not.exist');
      cy.get(makeCyDataSelector('iframe:parcel-locker-map')).should('not.exist');
      cy.get(makeCyDataSelector('button:choose-parcelLocker-tab')).click();

      // set parcel locker location
      cy.get('@shipmentParcelLockerContainer')
        .should('be.visible')
        .find(makeCyDataSelector('button:shipment__parcelLocker-location-selector'))
        .contains('Choose parcel locker location')
        .click();
      cy.get(makeCyDataSelector('iframe:parcel-locker-map'))
        .as('parcelLockerMapInsideIframe')
        .then(parcelMapIframeTimeoutOptionCfg, ($iframe): Promise<TParcelLocation> => {
          return new Promise((resolve) => {
            $iframe.on('load', () => {
              // choose first parcel locker from map's list
              chooseParcelLockerInsideIframe({
                $iframeContents: $iframe.contents(),
                liNthOfType: 1,
                resolve,
              });
            });
          });
        })
        .then((originalParcelLockerLocation) => {
          assertParcelLockerLocation(originalParcelLockerLocation);
          cy.wrap(originalParcelLockerLocation).as('originalParcelLockerLocation');
        });

      // change parcel locker location
      cy.contains(makeCyDataSelector('button:shipment__parcelLocker-location-selector'), 'Change location').click();
      cy.get('@parcelLockerMapInsideIframe')
        .then(parcelMapIframeTimeoutOptionCfg, ($iframe): Promise<TParcelLocation> => {
          const $iframeContents = $iframe.contents();
          return new Promise((resolve) => {
            // choose second parcel locker from map's list
            chooseParcelLockerInsideIframe({
              $iframeContents,
              liNthOfType: 2,
              resolve,
              preObserverCb: () => ($iframeContents.find('a[href="#close"]')[0] as HTMLAnchorElement).click(),
            });
          });
        })
        .then((updatedParcelLockerLocation) => {
          assertParcelLockerLocation(updatedParcelLockerLocation);
          cy.get('@originalParcelLockerLocation').then(([originalParcelLockerName, originalParcelLockerAddress]) => {
            expect(originalParcelLockerName).not.to.eq(updatedParcelLockerLocation[0]);
            expect(originalParcelLockerAddress).not.to.eq(updatedParcelLockerLocation[1]);
          });
        });
    }

    let checkFor: 'paymentMethod' | 'shipmentMethod';

    cy.intercept('/api/orders', (req) => {
      switch (checkFor) {
        case 'paymentMethod': {
          if (!paymentMethods.includes(req.body.paymentMethod)) {
            throw Error(`Unrecognized paymentMethod: "${req.body.paymentMethod}}"!`);
          }
          break;
        }
        case 'shipmentMethod': {
          if (!shipmentMethods.includes(req.body.shipmentMethod)) {
            throw Error(`Unrecognized shipmentMethod: "${req.body.shipmentMethod}}"!`);
          }
          break;
        }
      }

      req.alias = req.body[checkFor];
      req.reply({
        statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        body: { exception: 'Cypress is just testing different "order" variations' },
      });
    });

    // check different payment methods
    checkFor = 'paymentMethod';
    cy.wrap(paymentMethods)
      .each((paymentMethod: typeof paymentMethods[number]) => checkDifferentPaymentMethods(paymentMethod))
      .then(() => (checkFor = 'shipmentMethod'));

    // check different shipment methods
    cy.wrap(shipmentMethods).each((shipmentMethod: typeof shipmentMethods[number]) =>
      checkDifferentShipmentMethods(shipmentMethod)
    );
  });
});
