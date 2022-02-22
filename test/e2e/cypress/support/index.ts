/// <reference types="cypress" />

import type { TE2EUser } from '@src/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getAllEmails(): Cypress.Chainable<any>;
      deleteEmails(): Cypress.Chainable<Cypress.Response<any>>;
      getMatchingEmails(receiver: string, subject: string): Cypress.Chainable<any>;
      getEmailContent(receiver: string, subject: string): Cypress.Chainable<any>;
      getLinkFromEmail(receiver: string, subject: string, linkSelectorMatcher: string): Cypress.Chainable<URL>;
      registerTestUserByUI({ login, email }: Pick<TE2EUser, 'login' | 'email'>): void;
      confirmTestUserRegistrationByUI(email: string): Cypress.Chainable<URL>;
      registerTestUser(testUser: TE2EUser, canFail?: boolean): Cypress.Chainable<Cypress.Response<any>>;
      confirmTestUserRegistration(email: string): Cypress.Chainable<Chai.Assertion>;
      registerAndLoginTestUser(testUser: TE2EUser): Cypress.Chainable<any>;
      registerAndLoginTestUserByUI(testUser: TE2EUser): void;
      loginTestUser(
        testUser: Pick<TE2EUser, 'login' | 'password'>,
        canFail?: boolean
      ): Cypress.Chainable<Cypress.Response<any>>;
      loginTestUserByUI(testUser: Pick<TE2EUser, 'login' | 'password' | 'email'>): void;
      removeTestUsers(canFail?: boolean): Cypress.Chainable<Cypress.Response<any>>;
      getFromStorage(key: string): Cypress.Chainable<any>;
    }
  }
}

import './email-commands';
import './user-commands';
import './misc-commands';
