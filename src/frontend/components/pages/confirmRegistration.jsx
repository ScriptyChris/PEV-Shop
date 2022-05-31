import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import httpService from '@frontend/features/httpService';
import { ROUTES } from './_routes';

import { PEVLink, PEVHeading, PEVParagraph } from '@frontend/components/utils/formControls';

const translations = Object.freeze({
  header: 'Registration confirmation',
  status: 'Checking status',
  // TODO: [UX] waiting indicator should be some spinner
  waitingIndicator: '...',
  succeededIndicator: 'confirmed :)',
  failedIndicator: 'failed :(',
  succeededHint: (
    <>
      You can now{' '}
      <PEVLink to={ROUTES.LOG_IN} data-cy={`link:${ROUTES.LOG_IN}`}>
        click here
      </PEVLink>{' '}
      to log in to your new account.
    </>
  ),
  failedHint: `
    Provided token is invalid or has expired! 
    Please, ensure you used the exact token from received email or try to register again.
`.trim(),
  logIn: 'Log in',
});

const REG_CONFIRM_STATUS = Object.freeze({
  WAITING: 'WAITING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
});
const REG_CONFIRM_STATES = Object.freeze({
  WAITING: {
    INDICATOR: translations.waitingIndicator,
  },
  SUCCEEDED: {
    INDICATOR: translations.succeededIndicator,
    HINT: translations.succeededHint,
  },
  FAILED: {
    INDICATOR: translations.failedIndicator,
    HINT: translations.failedHint,
  },
});

export default function ConfirmRegistration() {
  const { search: searchParam } = useLocation();
  const [regConfirmStatus, setRegConfirmStatus] = useState(REG_CONFIRM_STATUS.WAITING);

  useEffect(() => {
    const token = new URLSearchParams(searchParam).get('token').replaceAll(' ', '+');

    if (token) {
      httpService
        .disableGenericErrorHandler()
        .confirmRegistration(token)
        .then((res) =>
          setRegConfirmStatus(res?.isUserConfirmed ? REG_CONFIRM_STATUS.SUCCEEDED : REG_CONFIRM_STATUS.FAILED)
        );
    } else {
      setRegConfirmStatus(REG_CONFIRM_STATUS.FAILED);
    }
  }, []);

  return (
    <section className="confirm-registration">
      <PEVHeading level={2}>{translations.header}</PEVHeading>

      <PEVParagraph>
        {translations.status}: <strong>{REG_CONFIRM_STATES[regConfirmStatus].INDICATOR}</strong>
      </PEVParagraph>

      {regConfirmStatus === REG_CONFIRM_STATUS.SUCCEEDED && (
        <>
          <PEVParagraph data-cy="message:registration-confirmation-succeeded-hint">
            {REG_CONFIRM_STATES.SUCCEEDED.HINT}
          </PEVParagraph>
        </>
      )}
      {regConfirmStatus === REG_CONFIRM_STATUS.FAILED && <p>{REG_CONFIRM_STATES.FAILED.HINT}</p>}
    </section>
  );
}
