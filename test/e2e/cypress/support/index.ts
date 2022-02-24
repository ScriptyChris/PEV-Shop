/// <reference types="cypress" />

import { TMessage } from './email-commands';
import type { TE2EUser } from '@src/types';
import type { IUserPublic } from '@database/models/_user';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getAllEmails(): Cypress.Chainable<TMessage[]>;
      deleteEmails(): Cypress.Chainable<Cypress.Response<void>>;
      getMatchingEmails(receiver: string, subject: string): Cypress.Chainable<TMessage[]>;
      getEmailContent(receiver: string, subject: string): Cypress.Chainable<string>;
      getLinkFromEmail(receiver: string, subject: string, linkSelectorMatcher: string): Cypress.Chainable<URL>;
      registerTestUserByUI({ login, email }: Pick<TE2EUser, 'login' | 'email'>): void;
      confirmTestUserRegistrationByUI(email: string): Cypress.Chainable<URL>;
      registerTestUser(testUser: TE2EUser, canFail?: boolean): Cypress.Chainable<Cypress.Response<TE2EUser>>;
      confirmTestUserRegistration(email: string): Cypress.Chainable<Chai.Assertion>;
      registerAndLoginTestUser(testUser: TE2EUser): Cypress.Chainable<IUserPublic>;
      registerAndLoginTestUserByUI(testUser: TE2EUser): void;
      loginTestUser(
        testUser: Pick<TE2EUser, 'login' | 'password'>,
        canFail?: boolean
      ): Cypress.Chainable<Cypress.Response<IUserPublic>>;
      loginTestUserByUI(testUser: Pick<TE2EUser, 'login' | 'password' | 'email'>): void;
      removeTestUsers(canFail?: boolean): Cypress.Chainable<Cypress.Response<void>>;
      getFromStorage<T = any>(key: string): Cypress.Chainable<T>;
      cleanupTestUsersAndEmails(): void;
    }
  }
}

// side effects only
import './email-commands';
import './user-commands';
import './misc-commands';
