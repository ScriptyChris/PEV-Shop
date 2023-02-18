/// <reference types="cypress" />

import { TMessage } from './email-commands';
import type { TE2EUser, IUserCart } from '@commons/types';
import type { TUserPublic, IUser, TProductPublic } from '@database/models';
import type { HeadersInit } from 'node-fetch';

// type TAPIEndpointGroup = 'users' | 'products'; // basically any API group used in tests
type TAPIReqOptions = {
  // TODO: [TS] use template interpolation with `TAPIEndpointGroup` after updating TS - it errors now
  // https://github.com/microsoft/TypeScript/issues/41651
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  payload?: any;
  extraHeaders?: HeadersInit;
  canFail?: boolean;
  shouldBeForm?: boolean;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getAllEmails(): Cypress.Chainable<TMessage[]>;
      deleteEmails(): Cypress.Chainable<Cypress.Response<void>>;
      getMatchingEmails(receiver: string, subject: string): Cypress.Chainable<TMessage[]>;
      getEmailContent(receiver: string, subject: string): Cypress.Chainable<string>;
      getLinkFromEmail(receiver: string, subject: string, linkSelectorMatcher: string): Cypress.Chainable<URL>;
      getAccountActivationLinkFromEmail(receiver: string): Cypress.Chainable<URL>;
      registerTestUserByUI({ login, email }: Pick<TE2EUser, 'login' | 'email'>): void;
      confirmTestUserRegistrationByUI(email: string): Cypress.Chainable<URL>;
      registerTestUser(testUser: TE2EUser, canFail?: boolean): Cypress.Chainable<Cypress.Response<TE2EUser>>;
      confirmTestUserRegistration(email: string): Cypress.Chainable<Chai.Assertion>;
      registerAndLoginTestUser(testUser: TE2EUser): Cypress.Chainable<TUserPublic>;
      loginTestUser(
        testUser: Pick<TE2EUser, 'login' | 'password'>,
        canFail?: boolean
      ): Cypress.Chainable<Cypress.Response<TUserPublic & { authToken: NonNullable<IUser['tokens']['auth']>[number] }>>;
      logoutUserFromAllSessions(
        authToken: NonNullable<IUser['tokens']['auth']>[number]
      ): Cypress.Chainable<Cypress.Response<void>>;
      loginTestUserByUI(testUser: Pick<TE2EUser, 'login' | 'password' | 'email'>): void;
      removeTestUsers(canFail?: boolean): Cypress.Chainable<Cypress.Response<void>>;
      getFromStorage<T = any>(key: string): Cypress.Chainable<T>;
      cleanupTestUsersAndEmails(): void;
      addTestProductByAPI(productData: TProductPublic, authToken: string): Cypress.Chainable<any>;
      removeTestProducts(productUrl: string, authToken: string): Cypress.Chainable<Cypress.Response<void>>;
      sendAPIReq(apiReqOptions: TAPIReqOptions): Cypress.Chainable<Cypress.Response<any>>;
      cleanupCartState(): void;
      findProductByNameInCartStore(productName: string): Cypress.Chainable<NonNullable<IUserCart['products'][number]>>;
    }
  }
}

// side effects only
import 'cypress-file-upload';
import './email-commands';
import './user-commands';
import './product-commands';
import './misc-commands';
