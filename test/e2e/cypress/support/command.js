import { ROUTES } from '../fixtures/_routes';

(function EmailCommands() {
  const getEmailAPIURL = (version) => {
    if (typeof version !== 'number') {
      throw ReferenceError('`version` must be provided as a number!');
    }

    return `http://localhost:${Cypress.env('MAIL_PORT')}/api/v${version}/messages`;
  };

  const getMatchingEmails = (messages, receiver, subject = null) => {
    if (typeof receiver !== 'string') {
      throw TypeError('`receiver` must be a string!');
    }

    return messages.filter((message) => {
      const matchedReceiver = message.Content.Headers.To.includes(receiver);
      const matchedSubject = subject !== null ? message.Content.Headers.Subject.includes(subject) : null;

      return matchedReceiver && matchedSubject !== false;
    });
  };

  const getLinkFromEmailContent = (content, linkSelectorMatcher) => {
    const document = new DOMParser().parseFromString(content, 'text/html');
    const link = document.querySelector(`a[href*="${linkSelectorMatcher}"]`);
    const slicedLink = link.href.slice(link.href.indexOf(linkSelectorMatcher));

    return slicedLink;
  };

  const getLatestMessageContent = (messages, receiver, subject) => {
    const matchingEmails = getMatchingEmails(messages, receiver, subject);
    const latestMessageContent = matchingEmails[0].Content.Body;

    // escape quoted-printable
    // https://github.com/mailhog/MailHog-UI/blob/master/assets/js/controllers.js#L425
    return latestMessageContent.replace(/=[\r\n]+/g, '').replaceAll('=3D', '=');
  };

  Cypress.Commands.add('getAllEmails', () => {
    // give Mailhog some time to process it's email queue
    cy.wait(Cypress.env('WAIT_TIME_IN_MS'));

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
  const userAPIReq = (urlSuffix, method, payload, canFail = true) => {
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

  Cypress.Commands.add('fillAndSendRegisterForm', ({ login, email, password = 'test password' }) => {
    cy.visit(ROUTES.REGISTER);
    cy.get('[data-cy="input:register-login"]').type(login);
    cy.get('[data-cy="input:register-password"]').type(password);
    cy.get('[data-cy="input:register-repeated-password"]').type(password);
    cy.get('[data-cy="input:register-email"]').type(email);
    cy.get('[data-cy="input:register-account-client-type"]').check();
    cy.get('[data-cy="button:submit-register"]').click();
    cy.contains(`[data-cy="button:go-to-login-from-register"]`, 'Go to login');
  });

  Cypress.Commands.add('confirmTestUserRegistration', (email) => {
    return cy.getLinkFromEmail(email, 'Account activation', '/pages/confirm-registration').then((url) => {
      cy.intercept('/api/users/confirm-registration', (req) => {
        req.continue((res) => {
          // TODO: [issue] sometimes `res.body.payload` is undefined due to 401 response code
          expect(res.body.payload.isUserConfirmed).to.be.true;
        });
      }).as('confirmRegistration');

      cy.visit(url);
      cy.wait('@confirmRegistration');
      cy.contains(
        '[data-cy="message:registration-confirmation-succeeded-hint"]',
        'You can now log in to your new account.'
      );
    });
  });

  Cypress.Commands.add('registerTestUser', (testUser, canFail) => {
    return userAPIReq('register', 'POST', testUser, canFail);
  });

  Cypress.Commands.add('registerAndLoginTestUserByUI', (testUser) => {
    cy.fillAndSendRegisterForm(testUser);
    cy.confirmTestUserRegistration(testUser.email);
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
    return cy.window().then((window) => JSON.parse(window.localStorage.getItem(key)));
  });
})();
