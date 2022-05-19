import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import httpService from '@frontend/features/httpService';
import { ROUTES } from './_routes';

import Typography from '@material-ui/core/Typography';
import MUILink from '@material-ui/core/Link';

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
      <MUILink to={ROUTES.LOG_IN} component={Link} data-cy={`link:${ROUTES.LOG_IN}`}>
        click here
      </MUILink>{' '}
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
      <Typography variant="h2">{translations.header}</Typography>

      <Typography variant="body1">
        {translations.status}: <strong>{REG_CONFIRM_STATES[regConfirmStatus].INDICATOR}</strong>
      </Typography>

      {regConfirmStatus === REG_CONFIRM_STATUS.SUCCEEDED && (
        <>
          <Typography variant="body1" data-cy="message:registration-confirmation-succeeded-hint">
            {REG_CONFIRM_STATES.SUCCEEDED.HINT}
          </Typography>
        </>
      )}
      {regConfirmStatus === REG_CONFIRM_STATUS.FAILED && <p>{REG_CONFIRM_STATES.FAILED.HINT}</p>}
    </section>
  );
}
