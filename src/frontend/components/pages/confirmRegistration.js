import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import apiService from '../../features/apiService';

const translations = Object.freeze({
  header: 'Registration confirmation',
  status: 'Checking status',
  // TODO: [UX] waiting indicator should be some spinner
  waitingIndicator: '...',
  succeededIndicator: 'confirmed :)',
  failedIndicator: 'failed :(',
  succeededHint: 'You can now log in to your new account.',
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
  const history = useHistory();
  const { search: searchParam } = useLocation();
  const [regConfirmStatus, setRegConfirmStatus] = useState(REG_CONFIRM_STATUS.WAITING);

  useEffect(() => {
    const token = new URLSearchParams(searchParam).get('token');

    if (token) {
      apiService
        .disableGenericErrorHandler()
        .confirmRegistration(token)
        .then((res) =>
          setRegConfirmStatus(res?.isUserConfirmed ? REG_CONFIRM_STATUS.SUCCEEDED : REG_CONFIRM_STATUS.FAILED)
        );
    } else {
      setRegConfirmStatus(REG_CONFIRM_STATUS.FAILED);
    }
  }, []);

  const logIn = () => history.push('/log-in');

  return (
    <section>
      <h2>{translations.header}</h2>

      <p>
        {translations.status}: {REG_CONFIRM_STATES[regConfirmStatus].INDICATOR}
      </p>

      {regConfirmStatus === REG_CONFIRM_STATUS.SUCCEEDED && (
        <>
          <p>{REG_CONFIRM_STATES.SUCCEEDED.HINT}</p>
          <button onClick={logIn}>{translations.logIn}</button>
        </>
      )}
      {regConfirmStatus === REG_CONFIRM_STATUS.FAILED && <p>{REG_CONFIRM_STATES.FAILED.HINT}</p>}
    </section>
  );
}
