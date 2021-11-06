import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Field } from 'formik';
import FormFieldError from '../utils/formFieldError';
import apiService from '../../features/apiService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '../../components/utils/popup';

const translations = Object.freeze({
  resetPasswordHeader: 'Reset password',
  resettingEmailField: 'Email associated with user account',
  submitReset: 'Reset',
  setNewPasswordHeader: 'Set new password',
  newPasswordField: 'Password',
  repeatedNewPasswordField: 'Repeat password',
  bothPasswordFieldsMustBeEqual: 'Both password fields must be equal!',
  submitNewPassword: 'Update password',
  resetPasswordSuccessMsg: `
    Account password reset procedure began! 
    To set up new password you need to click the link we sent you on email.
  `.trim(),
  resetPasswordFailureMsg: 'Failed to begin reset password procedure :(',
  resetPasswordSuccessAltMsg: "Email hasn't arrived yet? Click the button and we will re-send the email again.",
  popupReSendEmail: 'Re-send email',
  setNewPasswordEmptyTokenMsg: '// TODO: [UX] empty token case should be handled by routing guard',
  setNewPasswordSuccessMsg: `
    Account password reset completed! 
    You can now login with the new password.
  `.trim(),
  setNewPasswordFailureMsg: 'Failed to set new password :(',
  popupGoToLogIn: 'Go to log in',
});

function ResetPassword() {
  const [formInitials] = useState({
    email: '',
  });
  const [popupData, setPopupData] = useState(null);

  // TODO: [PERFORMANCE] set some debounce to limit number of sent requests per time
  const resendResetPassword = (email) => {
    apiService.resendResetPassword(email);
  };

  const onSubmitHandler = (values) => {
    apiService
      .disableGenericErrorHandler()
      .resetPassword(values.email)
      .then((res) => {
        console.log('reset password res:', res);

        if (res.__EXCEPTION_ALREADY_HANDLED) {
          return;
        } else if (res.__ERROR_TO_HANDLE) {
          setPopupData({
            type: POPUP_TYPES.FAILURE,
            message: translations.resetPasswordFailureMsg,
            buttons: [getClosePopupBtn(setPopupData)],
          });
        } else {
          setPopupData({
            type: POPUP_TYPES.SUCCESS,
            message: translations.resetPasswordSuccessMsg,
            altMessage: translations.resetPasswordSuccessAltMsg,
            buttons: [
              {
                onClick: () => resendResetPassword(values.email),
                text: translations.popupReSendEmail,
              },
            ],
          });
        }
      });
  };

  return (
    <section>
      <Formik onSubmit={onSubmitHandler} initialValues={formInitials}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <h2>{translations.resetPasswordHeader}</h2>
              </legend>

              <div>
                <label htmlFor="resettingEmail">{translations.resettingEmailField}</label>
                <Field name="email" id="resettingEmail" type="email" required />
              </div>

              <button>{translations.submitReset}</button>
            </fieldset>
          </form>
        )}
      </Formik>

      {popupData && <Popup {...popupData} />}
    </section>
  );
}

function SetNewPassword({ contextType = SetNewPassword.CONTEXT_TYPES.LOGGED_OUT }) {
  const [token, setToken] = useState('');
  const [formInitials] = useState({
    newPassword: '',
    repeatedNewPassword: '',
  });
  const [popupData, setPopupData] = useState(null);
  const history = useHistory();
  const { search: searchParam } = useLocation();

  useEffect(() => {
    const contextBasedToken =
      contextType === SetNewPassword.CONTEXT_TYPES.LOGGED_OUT
        ? new URLSearchParams(searchParam).get('token')
        : null; /* TODO: [FEATURE] take token either from passed prop or from store */

    setToken(contextBasedToken);
  }, []);

  const formValidator = (values) => {
    const errors = {};

    if (values.newPassword && values.repeatedNewPassword && values.newPassword !== values.repeatedNewPassword) {
      errors.newPassword = translations.bothPasswordFieldsMustBeEqual;
      errors.repeatedNewPassword = translations.bothPasswordFieldsMustBeEqual;
    }

    return errors;
  };

  const onSubmitHandler = (values) => {
    if (token) {
      // TODO: [FEATURE] implement changing password from /account/security path

      apiService
        .disableGenericErrorHandler()
        .setNewPassword(values.newPassword, token)
        .then((res) => {
          console.log('(resetPassword) res?', res);

          if (res.__EXCEPTION_ALREADY_HANDLED) {
            return;
          } else if (res.__ERROR_TO_HANDLE) {
            setPopupData({
              type: POPUP_TYPES.FAILURE,
              message: translations.setNewPasswordFailureMsg,
              buttons: [getClosePopupBtn(setPopupData)],
            });
          } else {
            setPopupData({
              type: POPUP_TYPES.SUCCESS,
              message: translations.setNewPasswordSuccessMsg,
              buttons: [
                {
                  onClick: () => history.push('/log-in'),
                  text: translations.popupGoToLogIn,
                },
              ],
            });
          }
        });
    } else {
      setPopupData({
        type: POPUP_TYPES.FAILURE,
        message: translations.setNewPasswordEmptyTokenMsg,
        buttons: [getClosePopupBtn(setPopupData)],
      });
    }
  };

  return (
    <section>
      <Formik onSubmit={onSubmitHandler} validateOnChange={false} validate={formValidator} initialValues={formInitials}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <h2>{translations.setNewPasswordHeader}</h2>
              </legend>

              {/* TODO: [DUP] move password related elements to generic component to avoid redundancy */}
              <div>
                <label htmlFor="newPassword">{translations.newPasswordField}</label>
                {/* TODO: [UX] add feature to temporary preview (unmask) the password field */}
                <Field name="newPassword" id="newPassword" type="password" minLength="8" maxLength="20" required />

                {formikRestProps.errors.newPassword && (
                  <FormFieldError>{formikRestProps.errors.newPassword}</FormFieldError>
                )}
              </div>
              <div>
                <label htmlFor="repeatedNewPassword">{translations.repeatedNewPasswordField}</label>
                <Field
                  name="repeatedNewPassword"
                  id="repeatedNewPassword"
                  type="password"
                  minLength="8"
                  maxLength="20"
                  required
                />

                {formikRestProps.errors.repeatedNewPassword && (
                  <FormFieldError>{formikRestProps.errors.repeatedNewPassword}</FormFieldError>
                )}
              </div>

              <button>{translations.submitNewPassword}</button>
            </fieldset>
          </form>
        )}
      </Formik>

      {popupData && <Popup {...popupData} />}
    </section>
  );
}
SetNewPassword.CONTEXT_TYPES = Object.freeze({
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGED_IN: 'LOGGED_IN',
});

export { ResetPassword, SetNewPassword };
