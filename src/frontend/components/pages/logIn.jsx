import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  PEVForm,
  PEVButton,
  PEVLink,
  PEVParagraph,
  PEVHeading,
  PEVTextField,
  PEVFieldset,
  PEVLegend,
} from '@frontend/components/utils/pevElements';
import userSessionService from '@frontend/features/userSessionService';
import { ROUTES } from './_routes';
import { PasswordField } from '@frontend/components/views/password';

const translations = Object.freeze({
  logInHeader: 'Login to shop',
  logInField: 'Login',
  passwordField: 'Password',
  submitLogIn: 'Login!',
  resetPasswordHint: `Don't remember password?`,
  resetPasswordLink: 'Reset it!',
});

export default function LogIn() {
  const formInitials = {
    login: '',
    password: '',
  };
  const history = useHistory();

  const onSubmitHandler = (values) => {
    userSessionService.logIn(values).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      /*
        TODO: [UX] redirect to the page where user was before logging in 
        OR just close/fold the form, if it is presented as a aside/sticky panel
      */
      history.push(ROUTES.ACCOUNT__ORDERS);
    });
  };

  return (
    <section className="login pev-fixed-container">
      <PEVForm onSubmit={onSubmitHandler} validateOnChange={false} initialValues={formInitials}>
        <PEVFieldset className="login__root-fieldset">
          <PEVLegend className="pev-centered-padded-text">
            <PEVHeading level={2}>{translations.logInHeader}</PEVHeading>
          </PEVLegend>

          <div className="pev-flex">
            <PEVTextField identity="login" label={translations.logInField} required data-cy="input:login" />
          </div>

          <PasswordField identity="password" label={translations.passwordField} dataCy="input:password" />

          <PEVButton className="login__submit-button" size="small" type="submit" data-cy="button:submit-login">
            {translations.submitLogIn}
          </PEVButton>
        </PEVFieldset>
      </PEVForm>

      <PEVParagraph className="login__reset-password-hint">
        {translations.resetPasswordHint}{' '}
        <PEVLink to={ROUTES.RESET_PASSWORD} data-cy={`link:${ROUTES.RESET_PASSWORD}`}>
          <em>{translations.resetPasswordLink}</em>
        </PEVLink>
      </PEVParagraph>

      {/* TODO: [UX] if User account is not confirmed, show an info with hint to re-send activation email */}
      {/* TODO: [UX] if User credentials are invalid, show regarding info instead of redirecting to /account  */}
    </section>
  );
}
