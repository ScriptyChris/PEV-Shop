import React from 'react';
import { PEVHeading, PEVParagraph, PEVLink } from '@frontend/components/utils/pevElements';
import { ROUTES } from '@frontend/components/pages/_routes';

const translations = Object.freeze({
  notAuthorizedHeader: `You are not authorized to access this page!`,
  goBackToAccountPage: 'Go back to your account.',
});

export default function NotAuthorized() {
  return (
    <>
      <PEVHeading level={2} className="pev-centered-padded-text">
        {translations.notAuthorizedHeader}
      </PEVHeading>
      <PEVParagraph className="pev-centered-padded-text">
        <PEVLink to={ROUTES.ACCOUNT}>{translations.goBackToAccountPage}</PEVLink>
      </PEVParagraph>
    </>
  );
}
