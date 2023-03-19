import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';

import { PEVHeading, PEVParagraph, PEVLink } from '@frontend/components/utils/pevElements';

const translations = Object.freeze({
  defaultContent: 'Sorry, but that page was not found!',
  createCustomHeader({ label, url } = {}) {
    if (!label || !url) {
      return this.defaultContent;
    }

    return `Sorry, but page for ${label} with url "${url}" was not found!`;
  },
  goBackPrefix: 'You can ',
  goBack: 'go back',
  goBackSuffix: ' to previous page.',
});

export default function NotFound() {
  const { state } = useLocation();
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  return (
    <>
      <PEVHeading level={2} className="pev-centered-padded-text">
        <NotListedLocationIcon fontSize="large" color="secondary" />
      </PEVHeading>
      <PEVParagraph className="pev-centered-padded-text">
        {translations.createCustomHeader(state)} {translations.goBackPrefix}
        <PEVLink to="" color="primary" onClick={handleGoBack}>
          {translations.goBack}
        </PEVLink>
        {translations.goBackSuffix}
      </PEVParagraph>
    </>
  );
}
