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
    return latestMessageContent.replace(/=[\r\n]+/gm, '').replace(/3D/gm, '');
  };

  Cypress.Commands.add('getAllEmails', () => {
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

  Cypress.Commands.add('registerTestUser', (testUser, canFail) => {
    return userAPIReq('register', 'POST', testUser, canFail);
  });

  Cypress.Commands.add('loginTestUser', (testUser, canFail) => {
    return userAPIReq('login', 'POST', testUser, canFail);
  });

  Cypress.Commands.add('removeTestUsers', (canFail) => {
    return userAPIReq(
      'delete',
      'DELETE',
      {
        queryType: 'regex',
        query: 'test user',
      },
      canFail
    );
  });
})();
