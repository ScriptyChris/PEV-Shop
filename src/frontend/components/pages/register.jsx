import React, { useState, useCallback } from 'react';
import { Formik, Field } from 'formik';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { FormikTextFieldForwarder } from '@frontend/components/utils/formControls';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { PasswordField } from '@frontend/components/views/password';
import { ROUTES } from './_routes';

const translations = Object.freeze({
  registerHeader: 'Account registration',
  logInField: 'Login',
  passwordField: 'Password',
  repeatedPasswordField: 'Repeat password',
  submitRegistration: 'Register',
  email: 'Email',
  accountType: 'Account type',
  clientType: 'Client',
  retailerType: 'Retailer',
  bothPasswordFieldsMustBeEqual: 'Both password fields must be equal!',
  registrationSuccessMsg: `
    Account registered! 
    You need to confirm your account via the link we sent you on email, 
    before you'll be able to log in.
  `.trim(),
  registrationFailureMsg: 'Failed to register new account :(',
  registrationSuccessAltMsg: "Email hasn't arrived yet? Click the button and we will re-send the email again.",
  popupReSendEmail: 'Re-send email',
  popupGoToLogin: 'Go to login',
});

export default function Register() {
  const formInitials = {
    login: '',
    password: '',
    repeatedPassword: '',
    email: '',
    accountType: '',
  };
  const [popupData, setPopupData] = useState(null);
  const history = useHistory();
  const getAccountTypeChangeHandler = useCallback((setFieldValue) => {
    return ({ target: { value } }) => {
      setFieldValue('accountType', value);
    };
  }, []);
  const accountTypes = /* TODO: [DX] should be synced with API */ [
    {
      value: 'client',
      label: translations.clientType,
      identity: 'registrationAccountClientType',
    },
    {
      value: 'retailer',
      label: translations.retailerType,
      identity: 'registrationAccountRetailerType',
    },
  ];

  // TODO: [UX] show password related errors independently, based on recently blurred field
  const formValidator = (values) => {
    const errors = {};

    if (values.password && values.repeatedPassword && values.password !== values.repeatedPassword) {
      errors.password = translations.bothPasswordFieldsMustBeEqual;
      errors.repeatedPassword = translations.bothPasswordFieldsMustBeEqual;
    }

    return errors;
  };

  const onSubmitHandler = (values) => {
    httpService
      .disableGenericErrorHandler()
      .registerUser({ ...values, repeatedPassword: undefined })
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: translations.registrationFailureMsg,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          setPopupData({
            type: POPUP_TYPES.SUCCESS,
            message: translations.registrationSuccessMsg,
            altMessage: translations.registrationSuccessAltMsg,
            buttons: [
              {
                onClick: () => history.push(ROUTES.LOG_IN),
                text: translations.popupGoToLogin,
                dataCy: 'button:go-to-login-from-register',
              },
            ],
            altButtons: [
              {
                onClick: () => resendConfirmRegistration(values.email),
                text: translations.popupReSendEmail,
                dataCy: 'button:resend-register-email',
              },
            ],
          });
        }
      });
  };

  // TODO: [PERFORMANCE] set some debounce to limit number of sent requests per time
  const resendConfirmRegistration = (email) => {
    httpService.resendConfirmRegistration(email);
  };

  return (
    <section className="register">
      <Formik onSubmit={onSubmitHandler} validateOnChange={false} validate={formValidator} initialValues={formInitials}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <fieldset className="register__root-fieldset MuiFormControl-root">
              <legend className="register__header MuiFormLabel-root">
                <Typography variant="h2" component="h2">
                  {translations.registerHeader}
                </Typography>
              </legend>

              <div className="register__login">
                <InputLabel htmlFor="registrationLogin">{translations.logInField}</InputLabel>
                <Field
                  component={FormikTextFieldForwarder}
                  variant="outlined"
                  size="small"
                  name="login"
                  id="registrationLogin"
                  required
                  data-cy="input:register-login"
                />
              </div>

              <PasswordField
                identity="password"
                translation={translations.passwordField}
                error={formikRestProps.errors.password}
                dataCy="input:register-password"
              />

              <PasswordField
                identity="repeatedPassword"
                translation={translations.repeatedPasswordField}
                error={formikRestProps.errors.repeatedPassword}
                dataCy="input:register-repeated-password"
              />

              <div className="register__email">
                <InputLabel htmlFor="registrationEmail">{translations.email}</InputLabel>
                <Field
                  component={FormikTextFieldForwarder}
                  variant="outlined"
                  size="small"
                  name="email"
                  id="registrationEmail"
                  type="email"
                  required
                  data-cy="input:register-email"
                />
              </div>

              <FormControl component="fieldset">
                <FormLabel component="legend">{translations.accountType}</FormLabel>
                <RadioGroup
                  className="register__account-types"
                  aria-label={translations.accountType.toLowerCase()}
                  name="accountType"
                  value={formikRestProps.values.accountType}
                  onChange={getAccountTypeChangeHandler(formikRestProps.setFieldValue)}
                >
                  {accountTypes.map((accountType) => (
                    <FormControlLabel
                      value={accountType.value}
                      control={
                        <Radio
                          id={accountType.identity}
                          inputProps={{ 'data-cy': `input:register-account-${accountType.value}-type` }}
                          required
                        />
                      }
                      label={accountType.label}
                      htmlFor={accountType.identity}
                      key={accountType.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Button
                className="register__submit-button"
                type="submit"
                variant="outlined"
                data-cy="button:submit-register"
              >
                {translations.submitRegistration}
              </Button>
            </fieldset>
          </form>
        )}
      </Formik>

      {popupData && <Popup {...popupData} />}
    </section>
  );
}
