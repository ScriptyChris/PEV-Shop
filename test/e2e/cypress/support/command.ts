import { cy, Cypress, expect } from 'local-cypress';
import { ROUTES } from '@srcForE2E/frontend/components/pages/_routes';
import type { TE2E, TE2EUser } from '@srcForE2E/types';

(function EmailCommands() {
  const getEmailAPIURL = (version: number) => {
    if (typeof version !== 'number') {
      throw ReferenceError('`version` must be provided as a number!');
    }

    return `http://localhost:${Cypress.env('MAIL_PORT')}/api/v${version}/messages`;
  };

  const getMatchingEmails = (messages: any[], receiver: string, subject: string | null = null) => {
    if (typeof receiver !== 'string') {
      throw TypeError('`receiver` must be a string!');
    }

    return messages.filter((message) => {
      const matchedReceiver = message.Content.Headers.To.includes(receiver);
      const matchedSubject = subject !== null ? message.Content.Headers.Subject.includes(subject) : null;

      return matchedReceiver && matchedSubject !== false;
    });
  };

  const getLinkFromEmailContent = (content: string, linkSelectorMatcher: string) => {
    const document = new DOMParser().parseFromString(content, 'text/html');
    const link = document.querySelector(`a[href*="${linkSelectorMatcher}"]`) as HTMLAnchorElement;

    return new URL(link.href);
  };

  const getLatestMessageContent = (messages: any[], receiver: string, subject: string) => {
    const matchingEmails = getMatchingEmails(messages, receiver, subject);
    const latestMessageContent = matchingEmails[0].Content.Body;

    // escape quoted-printable
    // https://github.com/mailhog/MailHog-UI/blob/master/assets/js/controllers.js#L425
    return latestMessageContent.replace(/=[\r\n]+/g, '').replace(/=3D/g, '=');
  };

  Cypress.Commands.add('getAllEmails', () => {
    /*
      TODO: [race condition] give Mailhog some time to process it's email queue.
      This seems to no longer be the issue, but if it will happen, then uncomment below line or implement re-sending request.
    */
    // cy.wait(Cypress.env('WAIT_TIME_IN_MS'));

    return cy.request(getEmailAPIURL(2)).then((res) => res.body.items);
  });

  Cypress.Commands.add('deleteEmails', () => {
    return cy.request('DELETE', getEmailAPIURL(1));
  });

  Cypress.Commands.add('getMatchingEmails', (receiver, subject) => {
    return cy.getAllEmails().then((messages) => {
      return getMatchingEmails(messages, receiver, subject);
    });
  });

  Cypress.Commands.add('getEmailContent', (receiver, subject) => {
    return cy.getAllEmails().then((messages) => getLatestMessageContent(messages, receiver, subject));
  });

  Cypress.Commands.add('getLinkFromEmail', (receiver, subject, linkSelectorMatcher) => {
    return cy
      .getEmailContent(receiver, subject)
      .then((emailContent) => getLinkFromEmailContent(emailContent, linkSelectorMatcher));
  });
})();

(function UserCommands() {
  const userAPIReq = (urlSuffix: string, method: string, payload: any, canFail = true) => {
    if (!urlSuffix || !method || !payload) {
      throw ReferenceError(
        `'urlSuffix', 'method' and 'payload' must be defined! 
        Received accordingly: '${urlSuffix}', '${method}' and '${JSON.stringify(payload)}'.`
      );
    }

    return cy.request({
      failOnStatusCode: canFail,
      url: `/api/users/${urlSuffix}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  };

  Cypress.Commands.add('registerTestUserByUI', ({ login, email }) => {
    const password = 'test password';

    cy.visit(ROUTES.REGISTER);
    cy.get('[data-cy="input:register-login"]').type(login);
    cy.get('[data-cy="input:register-password"]').type(password);
    cy.get('[data-cy="input:register-repeated-password"]').type(password);
    cy.get('[data-cy="input:register-email"]').type(email);
    cy.get('[data-cy="input:register-account-client-type"]').check();
    cy.get('[data-cy="button:submit-register"]').click();
    cy.contains(`[data-cy="button:go-to-login-from-register"]`, 'Go to login');
  });

  Cypress.Commands.add('confirmTestUserRegistrationByUI', (email) => {
    return cy.getLinkFromEmail(email, 'Account activation', '/pages/confirm-registration').then((link) => {
      cy.intercept('/api/users/confirm-registration', (req) => {
        req.continue((res) => {
          expect(res.body.payload.isUserConfirmed).to.be.true;
        });
      }).as('confirmRegistration');

      cy.visit(`${link.pathname}${link.search}`);
      cy.wait('@confirmRegistration');
      cy.contains(
        '[data-cy="message:registration-confirmation-succeeded-hint"]',
        'You can now log in to your new account.'
      );
    });
  });

  Cypress.Commands.add('registerTestUser', (testUser, canFail?) => {
    return userAPIReq('register', 'POST', testUser, canFail);
  });

  Cypress.Commands.add('confirmTestUserRegistration', (email) => {
    return cy
      .getLinkFromEmail(email, 'Account activation', '/pages/confirm-registration')
      .then((link) => {
        const token = (new URLSearchParams(link.search).get('token') as string).replace(/\s/g, '+');

        return userAPIReq('confirm-registration', 'POST', { token });
      })
      .then((res) => expect(res.body.payload.isUserConfirmed).to.be.true);
  });

  Cypress.Commands.add('registerAndLoginTestUser', (testUser) => {
    return cy
      .registerTestUser(testUser)
      .then(() => cy.confirmTestUserRegistration(testUser.email))
      .then(() => cy.window())
      .then((win: Cypress.AUTWindow & { __E2E__: TE2E }) => win.__E2E__.userSessionService.logIn(testUser))
      .then((res) => {
        expect(res).to.include({
          login: testUser.login,
          email: testUser.email,
        });

        return res;
      });
  });

  Cypress.Commands.add('registerAndLoginTestUserByUI', (testUser) => {
    cy.registerTestUserByUI(testUser);
    cy.confirmTestUserRegistrationByUI(testUser.email);
    cy.get('[data-cy="button:log-in-after-confirmed-registration"]').click();

    return cy.loginTestUserByUI(testUser);
  });

  Cypress.Commands.add('loginTestUser', (testUser, canFail) => {
    return userAPIReq('login', 'POST', testUser, canFail);
  });

  Cypress.Commands.add('loginTestUserByUI', (testUser) => {
    cy.get('[data-cy="input:login"]').type(testUser.login);
    cy.get('[data-cy="input:password"]').type(testUser.password);
    cy.intercept('/api/users/login', (req) => {
      req.continue((res) => {
        expect(res.body.payload).to.include({
          login: testUser.login,
          email: testUser.email,
        });
      });
    }).as('loginUser');
    cy.get('[data-cy="button:submit-login"]').click();
    cy.wait('@loginUser');
  });

  Cypress.Commands.add('removeTestUsers', (canFail) => {
    return userAPIReq(
      'delete',
      'DELETE',
      {
        queryType: 'regex',
        rawQuery: 'test user',
      },
      canFail
    );
  });
})();

(function MiscCommands() {
  Cypress.Commands.add('getFromStorage', (key) => {
    return cy.window().then((window) => JSON.parse(window.localStorage.getItem(key) as string));
  });
})();
