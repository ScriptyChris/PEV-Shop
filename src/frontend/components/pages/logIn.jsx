import React from 'react';
import { Formik, Field } from 'formik';
import { Link, useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MUILink from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import { FormikTextFieldForwarder } from '@frontend/components/utils/formControls';
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
      history.push(ROUTES.ROOT);
    });
  };

  return (
    <section className="login">
      <Formik onSubmit={onSubmitHandler} validateOnChange={false} initialValues={formInitials}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <fieldset className="login__root-fieldset MuiFormControl-root">
              <legend className="login__header MuiFormLabel-root">
                <Typography variant="h2">{translations.logInHeader}</Typography>
              </legend>

              <div className="login__login-field">
                <InputLabel htmlFor="login">{translations.logInField}</InputLabel>
                <Field
                  component={FormikTextFieldForwarder}
                  variant="outlined"
                  size="small"
                  id="login"
                  name="login"
                  required
                  data-cy="input:login"
                />
              </div>

              <PasswordField identity="password" translation={translations.passwordField} dataCy="input:password" />

              <Button
                className="login__submit-button"
                variant="outlined"
                size="small"
                type="submit"
                data-cy="button:submit-login"
              >
                {translations.submitLogIn}
              </Button>
            </fieldset>
          </form>
        )}
      </Formik>

      <Typography variant="body1" className="login__reset-password-hint">
        {translations.resetPasswordHint}{' '}
        <MUILink to={ROUTES.RESET_PASSWORD} component={Link} data-cy={`link:${ROUTES.RESET_PASSWORD}`}>
          {translations.resetPasswordLink}
        </MUILink>
      </Typography>

      {/* TODO: [UX] if User account is not confirmed, show an info with hint to re-send activation email */}
      {/* TODO: [UX] if User credentials are invalid, show regarding info instead of redirecting to /account  */}
    </section>
  );
}
