import { describe, it, cy, beforeEach, context, expect, after, Cypress } from 'local-cypress';
import { ROUTES } from '@frontend/components/pages/_routes';
import { makeCyDataSelector } from '../synchronous-helpers';
import { TE2EUser, HTTP_STATUS_CODE } from '@commons/types';
import * as users from '@database/populate/initialData/users.json';

const exampleSellerUser = (users as TE2EUser[])[1];

describe('product-form', () => {
  const { forForm: testProductDataForForm, forAPI: testProductDataForAPI } = getTestProductData();
  let authToken: string;

  const goToProductModificationPage = (productName: string) => {
    cy.visit(ROUTES.PRODUCTS);
    cy.get(makeCyDataSelector('input:search-products-by-name')).type(productName);
    cy.contains(
      `${makeCyDataSelector('container:search-tab-panel__results')} ${makeCyDataSelector('label:product-card__name')}`,
      productName
    )
      .closest(makeCyDataSelector('link:product-card__link'))
      .click();
    cy.get(makeCyDataSelector('button:product-details__edit-product')).click();
  };

  const assertProductDataInsideForm = (productData: typeof testProductDataForForm) => {
    cy.intercept(/\/public\/images\//, (req) => {
      expect(req.method).to.eq('GET');
      req.continue((res) => {
        expect(res.statusCode).to.be.oneOf([HTTP_STATUS_CODE.OK, HTTP_STATUS_CODE.NOT_MODIFIED]);

        if (res.statusCode === HTTP_STATUS_CODE.NOT_MODIFIED) {
          return;
        }

        expect(res.headers).to.haveOwnProperty('content-type').that.contains('image/');
        expect(res.headers['content-length']).not.to.be.empty;
        expect(Number(res.headers['content-length'])).to.be.greaterThan(0);
      });
    }).as('loadingProductAttachedImage');
    goToProductModificationPage(productData.name);

    cy.get(makeCyDataSelector('input:base__name')).should('have.value', productData.name);
    cy.get(makeCyDataSelector('input:base__price')).should('have.value', productData.price);
    cy.wrap(productData.descriptions).then((descs) => {
      cy.wrap(descs.map((desc, index) => cy.contains(makeCyDataSelector(`label:shortDescription__${index}`), desc)));
    });
    cy.get(makeCyDataSelector('input:category_names')).should('have.value', productData.category);
    cy.wrap(productData.specs).then((specs) => {
      cy.wrap(
        Object.entries(specs).map(([specName, specValue]) =>
          cy.get(makeCyDataSelector(`input:spec__${specName}`)).should('have.value', specValue)
        )
      );
    });
    cy.wait('@loadingProductAttachedImage');
    cy.get(makeCyDataSelector('label:attached-images-count'))
      .invoke('text')
      .should('be.equal', `${productData.images.length}/3`);
    cy.wrap(productData.images).each(({ name }: typeof productData.images[number], index) => {
      cy.contains(makeCyDataSelector(`label:attached-image-${index}-caption`), name);
    });
    cy.wrap(productData.relatedProductNames).then((relatedProductNames) => {
      cy.wrap(
        relatedProductNames.map((relatedProductName, index) =>
          cy.contains(makeCyDataSelector(`label:related-product-names__${index}`), relatedProductName)
        )
      );
    });
  };

  beforeEach(() => {
    cy.visit(ROUTES.LOG_IN);
    cy.loginTestUserByUI(exampleSellerUser);
    cy.get('@_authToken').then((_authToken) => {
      // cache `authToken` for each test
      authToken = _authToken as unknown as string;
      cy.removeTestProducts(testProductDataForAPI.url, authToken);
    });
  });

  after(() => {
    cy.removeTestProducts(testProductDataForAPI.url, authToken);
    cy.logoutUserFromAllSessions(authToken);
  });

  context('modify existing product', () => {
    beforeEach(() => {
      const imageFiles: File[] = [];

      cy.wrap(testProductDataForAPI.images).each(({ src }: typeof testProductDataForAPI.images[number], index) => {
        // Don't use `.fixture()`, because it caches file affecting later usage of `.attachFile()`.
        cy.readFile(`${Cypress.config('fixturesFolder')}/${src}`, null).then((img) => {
          const imgFile = new File([img], src, { type: 'image/png' }) as any;

          // Don't use `.push()` to avoid causing possible insertion disorder due to `.readFile()` async resolution.
          imageFiles[index] = imgFile;
        });
      });
      cy.wrap(imageFiles)
        .should('have.length', testProductDataForAPI.images.length)
        .then((imageFiles) => {
          cy.addTestProductByAPI({ ...testProductDataForAPI, images: imageFiles as unknown as [] }, authToken);
        });
    });

    it('form should contain proper data', () => {
      assertProductDataInsideForm(testProductDataForForm);
    });

    it('should update product data', () => {
      goToProductModificationPage(testProductDataForForm.name);
      const updatedProductFormData = getUpdatedTestProductFormData();

      // TODO: [E2E] uncomment this when API will only recognize products by their ID instead of name
      // cy.get(makeCyDataSelector('input:base__name')).clear().type(testProductDataForForm.updatedName);
      cy.get(makeCyDataSelector('input:base__price')).clear().type(updatedProductFormData.raw.price);

      cy.get(makeCyDataSelector('list:shortDescription'))
        .children()
        .as('productDescriptionsItems')
        .should('have.length', 3);
      // delete second (first indexed) description
      cy.get(makeCyDataSelector('button:shortDescription__delete-1')).click();
      cy.get('@productDescriptionsItems').should('have.length', 2);
      // edit first description
      cy.get(makeCyDataSelector('button:shortDescription__edit-0')).click();
      cy.get(makeCyDataSelector('input:shortDescription__0')).clear().type('Updated test description');
      cy.get(makeCyDataSelector('button:shortDescription__confirm-0')).click();
      cy.get('@productDescriptionsItems').should('have.length', 2);

      cy.get(makeCyDataSelector('list:categories_names'))
        .children(`:contains(${updatedProductFormData.raw.category})`)
        .click();
      cy.wrap(updatedProductFormData.raw.specs).then((updatedSpecs) => {
        cy.wrap(
          Object.entries(updatedSpecs).map(([updatedSpecName, updatedSpecValue]) =>
            cy
              .get(makeCyDataSelector(`input:spec__${updatedSpecName}`))
              .clear()
              .type(String(updatedSpecValue))
          )
        );
      });

      /*
        TODO: [feature] implement modifying images
        For now: ensure images cannot me modified.
      */
      cy.get(makeCyDataSelector('input:add-new-image')).should('be.disabled');
      cy.wrap(updatedProductFormData.assertable.images).each((_, index) =>
        cy.get(makeCyDataSelector(`button:remove-${index}-uploaded-image`)).should('be.disabled')
      );

      // delete second (first indexed) related product name
      cy.get(makeCyDataSelector('list:related-product-names'))
        .as('relatedProductNames')
        .children()
        .should('have.length', 2);
      cy.get(makeCyDataSelector('button:related-product-names__delete-1')).click();
      cy.get('@relatedProductNames').children().should('have.length', 1);
      cy.get(makeCyDataSelector('button:related-product-names__edit-0')).click();
      cy.get(makeCyDataSelector('button:related-product-names__cancel-0')).should('be.visible');
      cy.get('@relatedProductNames')
        .find(makeCyDataSelector('input:search-single-product-by-name'))
        .clear()
        .type(updatedProductFormData.raw.relatedProductName.part);
      cy.get('@relatedProductNames').within(() => {
        cy.get(makeCyDataSelector('datalist:the-search-options'))
          .children(`[value="${updatedProductFormData.raw.relatedProductName.whole}"]`)
          .should('exist');
        cy.get(makeCyDataSelector('input:search-single-product-by-name'))
          .clear()
          .type(updatedProductFormData.raw.relatedProductName.whole);
      });
      cy.get(makeCyDataSelector('label:related-product-names__0')).should('be.visible');
      cy.get(makeCyDataSelector('button:related-product-names__cancel-0')).should('not.exist');
      cy.get('@relatedProductNames').children().should('have.length', 1);

      // modify product
      cy.intercept('/api/products', (req) => {
        req.headers.Authorization = `Bearer ${authToken}`;
        req.continue((res) => {
          expect(res.statusCode).to.eq(HTTP_STATUS_CODE.OK);
        });
      });
      cy.get(makeCyDataSelector('button:product-form__save')).click();

      // assert update succeeded
      assertProductDataInsideForm(updatedProductFormData.assertable);
    });
  });

  context('add new product', () => {
    it('should add new product', () => {
      // assert that to-be-added product doesn't exist yet
      cy.visit(ROUTES.PRODUCTS);
      cy.get(makeCyDataSelector('input:search-products-by-name')).type(testProductDataForForm.name);
      cy.contains(
        `${makeCyDataSelector('container:search-tab-panel__results')} ${makeCyDataSelector(
          'message:empty-search-results'
        )}`,
        `No products found for name: "${testProductDataForForm.name}"`
      );

      // go to adding new product page
      cy.get(`a[href="${ROUTES.PRODUCTS__ADD_NEW_PRODUCT}"]`).click();

      // assert form is empty
      cy.get(makeCyDataSelector('input:base__name')).should('have.value', '');
      cy.get(makeCyDataSelector('input:base__price')).should('have.value', '');
      cy.get(makeCyDataSelector('button:shortDescription__add-new'))
        .prev(makeCyDataSelector('list:shortDescription'))
        .children()
        .should('have.length', 0);
      cy.get(makeCyDataSelector('input:category_names')).should('have.value', '');
      cy.get(makeCyDataSelector('list:product-technical-specs')).should('not.exist');
      cy.get(makeCyDataSelector('label:product-technical-specs__category-choice-reminder')).should('be.visible');
      cy.get(makeCyDataSelector('label:attached-images-count')).invoke('text').should('be.equal', `0/3`);
      cy.get('[data-cy^="label:attached-image-"]').should('not.exist');
      cy.get(makeCyDataSelector('button:related-product-names__add-new'))
        .prev(makeCyDataSelector('list:related-product-names'))
        .children()
        .should('have.length', 0);

      // fill form with new data
      cy.get(makeCyDataSelector('input:base__name')).type(testProductDataForForm.name);
      cy.get(makeCyDataSelector('input:base__price')).type(testProductDataForForm.price);
      cy.wrap(testProductDataForForm.descriptions).then((descs) => {
        cy.wrap(
          descs.map((desc, index) => {
            cy.get(makeCyDataSelector('button:shortDescription__add-new')).click();
            cy.get(makeCyDataSelector('input:shortDescription__new')).type(String(desc));
            cy.get(makeCyDataSelector('button:shortDescription__confirm-new')).click();
            // assert correct description data
            cy.contains(makeCyDataSelector(`label:shortDescription__${index}`), desc);
          })
        );
      });
      cy.get(makeCyDataSelector('list:categories_names'))
        .children(`:contains(${testProductDataForForm.category})`)
        .click();
      cy.wrap(testProductDataForForm.specs).then((specs) => {
        cy.wrap(
          Object.entries(specs).map(([specName, specValue]) =>
            cy.get(makeCyDataSelector(`input:spec__${specName}`)).type(String(specValue))
          )
        );
      });
      cy.wrap(testProductDataForAPI.images).each(({ src }: typeof testProductDataForAPI.images[number]) => {
        // Method `attachFile()` takes an image path and uses `cy.fixture()` to load actual file
        cy.get(makeCyDataSelector('input:add-new-image')).attachFile(src);
      });
      cy.wrap(testProductDataForForm.relatedProductNames).then((relatedProductNames) => {
        cy.get(makeCyDataSelector('list:related-product-names')).within(() =>
          relatedProductNames.map((relatedProductName, index) => {
            cy.root().next(makeCyDataSelector('button:related-product-names__add-new')).click();
            cy.get(makeCyDataSelector('input:search-single-product-by-name')).type(relatedProductName);
            // assert correct related product name
            cy.contains(makeCyDataSelector(`label:related-product-names__${index}`), relatedProductName);
          })
        );
      });

      // save new product
      cy.intercept('/api/products', (req) => {
        req.headers.Authorization = `Bearer ${authToken}`;
        req.continue((res) => {
          expect(res.body).to.include({
            message: 'Success!',
          });
        });
      });
      cy.get(makeCyDataSelector('button:product-form__save')).click();

      // assert new product has been saved by checking it's modification form
      assertProductDataInsideForm(testProductDataForForm);
    });
  });
});

function getTestProductData() {
  const forForm = {
    name: 'Some Test Product',
    price: '1234',
    descriptions: ['A dummy sentence', 'Test something', "Like whatever. It doesn't matter"],
    category: 'Advanced Electric Wheels',
    specs: {
      weight: 32,
      battery_capacity: 720,
      top_speed: 15,
      range: 45,
      max_load: 210,
      motor_power: 640,
      charge_time: 3,
    } as Record<string, unknown>,
    relatedProductNames: [
      'King Song 14D, 340/420Wh Battery, 800W Motor',
      'Inmotion V10/V10F, 960Wh Battery/2000W Motor',
    ],
    images: [
      {
        src: 'test image 1.png',
        name: 'test image 1',
      },
      {
        src: 'test image 2.png',
        name: 'test image 2',
      },
    ],
  };

  const forAPI = {
    name: forForm.name,
    url: 'some-test-product',
    category: forForm.category,
    price: Number(forForm.price),
    shortDescription: forForm.descriptions,
    technicalSpecs: [
      {
        heading: 'weight',
        data: forForm.specs.weight,
        defaultUnit: 'lbs',
      },
      {
        heading: 'battery capacity',
        data: forForm.specs.battery_capacity,
        defaultUnit: 'Wh',
      },
      {
        heading: 'top speed',
        data: forForm.specs.top_speed,
        defaultUnit: 'mph',
      },
      {
        heading: 'range',
        data: forForm.specs.range,
        defaultUnit: 'miles',
      },
      {
        heading: 'max load',
        data: forForm.specs.max_load,
        defaultUnit: 'lbs',
      },
      {
        heading: 'motor power',
        data: forForm.specs.motor_power,
        defaultUnit: 'W',
      },
      {
        heading: 'charge time',
        data: forForm.specs.charge_time,
        defaultUnit: 'hr',
      },
    ],
    relatedProductsNames: forForm.relatedProductNames,
    images: forForm.images,
  };

  return { forForm, forAPI };
}

function getUpdatedTestProductFormData() {
  const raw = {
    name: 'Some Test Product',
    price: '4321',
    category: 'Accessories',
    specs: {
      weight: 50,
      dimensions__length: 20,
      dimensions__width: 10,
      dimensions__height: 5,
      colour: 'red',
    },
    relatedProductName: {
      part: 'Dualtron',
      whole: 'NEW: Dualtron 3. 1,658Wh/2x 800W (1600W) Motors',
    },
    // TODO: [E2E] test it when image modification will work
    //images: [],
  };

  const assertable = {
    name: raw.name,
    price: raw.price,
    category: raw.category,
    descriptions: ['Updated test description', "Like whatever. It doesn't matter"],
    specs: raw.specs,
    relatedProductNames: ['NEW: Dualtron 3. 1,658Wh/2x 800W (1600W) Motors'],
    images: [
      { src: 'some-test-product/test image 1.png', name: 'test image 1' },
      { src: 'some-test-product/test image 2.png', name: 'test image 2' },
    ],
  };

  return { raw, assertable };
}
