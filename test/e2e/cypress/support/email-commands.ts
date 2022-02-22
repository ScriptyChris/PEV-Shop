import { cy, Cypress } from 'local-cypress';

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
