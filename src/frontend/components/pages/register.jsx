import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { useHistory } from 'react-router-dom';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { PasswordField } from '@frontend/components/views/password';
import { ROUTES } from './_routes';

const translations = Object.freeze({
  registerHeader: 'Account registration',
  logInField: 'Login',
  passwordField: 'Password',
  repeatedPasswordField: 'Repeat password',
  submitRegistration: 'Register!',
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
  const [formInitials] = useState({
    login: '',
    password: '',
    repeatedPassword: '',
    email: '',
    accountType: '',
  });
  const [popupData, setPopupData] = useState(null);
  const history = useHistory();

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
    <section>
      <Formik onSubmit={onSubmitHandler} validateOnChange={false} validate={formValidator} initialValues={formInitials}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <h2>{translations.registerHeader}</h2>
              </legend>

              <div>
                <label htmlFor="registrationLogin">{translations.logInField}</label>
                <Field name="login" id="registrationLogin" required data-cy="input:register-login" />
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

              <div>
                <label htmlFor="registrationEmail">{translations.email}</label>
                <Field name="email" id="registrationEmail" type="email" required data-cy="input:register-email" />
              </div>

              <div id="accountTypesGroup">{translations.accountType}</div>
              <div role="group" aria-labelledby="accountTypesGroup">
                <label htmlFor="registrationAccountClientType">{translations.clientType}</label>
                <Field
                  name="accountType"
                  id="registrationAccountClientType"
                  type="radio"
                  value={translations.clientType.toLowerCase()}
                  required
                  data-cy="input:register-account-client-type"
                />

                <label htmlFor="registrationAccountRetailerType">{translations.retailerType}</label>
                <Field
                  name="accountType"
                  id="registrationAccountRetailerType"
                  type="radio"
                  value={translations.retailerType.toLowerCase()}
                  required
                />
              </div>

              <button type="submit" data-cy="button:submit-register">
                {translations.submitRegistration}
              </button>
            </fieldset>
          </form>
        )}
      </Formik>

      {popupData && <Popup {...popupData} />}
    </section>
  );
}
