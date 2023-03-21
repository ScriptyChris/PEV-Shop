import React from 'react';
import { PEVHeading, PEVParagraph, PEVLink } from '@frontend/components/utils/pevElements';
import { ROUTES } from '@frontend/components/pages/_routes';

const translations = Object.freeze({
  notLoggedInHeader: 'You are not logged in!',
  goToLoginPage: 'Click here to log in.',
});

export default function NotLoggedIn() {
  return (
    <>
      <PEVHeading level={2} className="pev-centered-padded-text">
        {translations.notLoggedInHeader}
      </PEVHeading>
      <PEVParagraph className="pev-centered-padded-text">
        <PEVLink to={ROUTES.LOG_IN}>{translations.goToLoginPage}</PEVLink>
      </PEVParagraph>
    </>
  );
}
