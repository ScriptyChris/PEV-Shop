const getMessageContent = (messages, receiver, subject = null) => {
  for (const message of messages) {
    const matchedReceiver = message.Content.Headers.To.includes(receiver);
    const matchedSubject = subject !== null ? message.Content.Headers.Subject.includes(subject) : null;

    if (matchedReceiver && matchedSubject !== false) {
      return message.Content.Body;
    }
  }
};

Cypress.Commands.add('getEmailContent', (receiver, subject) => {
  if (typeof receiver !== 'string') {
    throw TypeError('`receiver` must be a string!');
  }

  return cy.request(`http://localhost:${Cypress.env('MAIL_PORT')}/api/v2/messages`).then((res) => {
    const message = getMessageContent(res.body.items, receiver, subject);
    console.log('message:', message);

    // escape quoted-printable
    // https://github.com/mailhog/MailHog-UI/blob/master/assets/js/controllers.js#L425
    return message.replace(/=[\r\n]+/gm, '').replace(/3D/gm, '');
  });
});

Cypress.Commands.add('getLinkFromEmailContent', (content, linkSelectorMatcher) => {
  const document = new DOMParser().parseFromString(content, 'text/html');
  const link = document.querySelector(`a[href*="${linkSelectorMatcher}"]`);
  const slicedLink = link.href.slice(link.href.indexOf(linkSelectorMatcher));

  return slicedLink;
});
