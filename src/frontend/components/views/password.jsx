import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Field } from 'formik';

import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import FormFieldError from '@frontend/components/utils/formFieldError';
import { FormikTextFieldForwarder } from '@frontend/components/utils/formControls';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { ROUTES } from '@frontend/components/pages/_routes';

const translations = Object.freeze({
  resetPasswordHeader: 'Reset password',
  resettingEmailField: 'Email associated with user account',
  submitReset: 'Reset',
  setNewPasswordHeader: 'Set new password',
  currentPasswordField: 'Password',
  newPasswordField: 'New password',
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
  changePasswordSuccessMsg: 'Password changed!',
  changePasswordFailureMsg: 'Failed to change password :(',
  popupGoToLogIn: 'Go to log in',
});

function PasswordField({ identity, translation, error, dataCy }) {
  if (!identity || !translation) {
    throw ReferenceError(
      `'identity' and 'translation' props must be non-empty! Received subsequently: '${identity}' and '${translation}'`
    );
  }

  // TODO: [REFACTOR] take these values from some global config
  const [passwordMinLength, passwordMaxLength] = [8, 20];

  return (
    <div className="password-field">
      <InputLabel htmlFor={identity}>{translation}</InputLabel>
      {/* TODO: [UX] add feature to temporary preview (unmask) the password field */}
      <Field
        type="password"
        component={FormikTextFieldForwarder}
        name={identity}
        id={identity}
        variant="outlined"
        size="small"
        inputProps={{
          minLength: passwordMinLength,
          maxLength: passwordMaxLength,
        }}
        required
        data-cy={dataCy}
      />

      {error && <FormFieldError>{error}</FormFieldError>}
    </div>
  );
}

function ResetPassword() {
  const formInitials = {
    email: '',
  };
  const [popupData, setPopupData] = useState(null);

  // TODO: [PERFORMANCE] set some debounce to limit number of sent requests per time
  const resendResetPassword = (email) => {
    httpService.resendResetPassword(email);
  };

  const onSubmitHandler = (values) => {
    httpService
      .disableGenericErrorHandler()
      .resetPassword(values.email)
      .then((res) => {
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
    <section className="reset-password">
      <Formik onSubmit={onSubmitHandler} initialValues={formInitials}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <fieldset className="reset-password__root-fieldset MuiFormControl-root">
              <legend className="reset-password__header MuiFormLabel-root">
                <Typography variant="h2">{translations.resetPasswordHeader}</Typography>
              </legend>

              <div className="reset-password__email-field">
                <InputLabel htmlFor="resettingEmail">{translations.resettingEmailField}</InputLabel>
                <Field
                  component={FormikTextFieldForwarder}
                  name="email"
                  id="resettingEmail"
                  type="email"
                  variant="outlined"
                  size="small"
                  required
                  data-cy="input:reset-email"
                />
              </div>

              <Button
                className="reset-password__submit-btn"
                type="submit"
                variant="outlined"
                size="small"
                data-cy="button:submit-reset"
              >
                {translations.submitReset}
              </Button>
            </fieldset>
          </form>
        )}
      </Formik>

      <Popup {...popupData} />
    </section>
  );
}

function SetNewPassword({ contextType }) {
  if (!Object.keys(SetNewPassword.CONTEXT_TYPES).some((contextKey) => contextKey === contextType)) {
    throw ReferenceError(
      `'contextType' must be either of '${Object.keys(SetNewPassword.CONTEXT_TYPES)}'! Received '${contextType}'.`
    );
  }

  const [urlToken, setUrlToken] = useState(null);
  const formInitials = {
    currentPassword: contextType === SetNewPassword.CONTEXT_TYPES.LOGGED_IN ? '' : undefined,
    newPassword: '',
    repeatedNewPassword: '',
  };
  const [popupData, setPopupData] = useState(null);
  const history = useHistory();
  const { search: searchParam } = useLocation();

  useEffect(() => {
    if (contextType === SetNewPassword.CONTEXT_TYPES.LOGGED_OUT) {
      setUrlToken(new URLSearchParams(searchParam).get('token'));
    }
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
    if (contextType === SetNewPassword.CONTEXT_TYPES.LOGGED_IN) {
      httpService
        .disableGenericErrorHandler()
        .changePassword(values.currentPassword, values.newPassword)
        .then((res) => {
          if (res.__EXCEPTION_ALREADY_HANDLED) {
            return;
          } else if (res.__ERROR_TO_HANDLE) {
            setPopupData({
              type: POPUP_TYPES.FAILURE,
              // TODO: [UX] also show failure reason
              message: translations.changePasswordFailureMsg,
              buttons: [getClosePopupBtn(setPopupData)],
            });
          } else {
            setPopupData({
              type: POPUP_TYPES.SUCCESS,
              message: translations.changePasswordSuccessMsg,
              buttons: [getClosePopupBtn(setPopupData)],
            });
          }
        });
    } else if (urlToken) {
      httpService
        .disableGenericErrorHandler()
        .setNewPassword(values.newPassword, urlToken)
        .then((res) => {
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
                  onClick: () => history.push(ROUTES.LOG_IN),
                  text: translations.popupGoToLogIn,
                  dataCy: 'button:go-to-login-from-new-password',
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
    <section className="set-new-password">
      <Formik onSubmit={onSubmitHandler} validateOnChange={false} validate={formValidator} initialValues={formInitials}>
        {({ handleSubmit, ...formikRestProps }) => (
          <form onSubmit={handleSubmit}>
            <fieldset className="set-new-password__root-fieldset">
              <legend>
                <h2>{translations.setNewPasswordHeader}</h2>
              </legend>

              {contextType === SetNewPassword.CONTEXT_TYPES.LOGGED_IN && (
                <PasswordField
                  identity="currentPassword"
                  translation={translations.currentPasswordField}
                  error={formikRestProps.errors.currentPassword}
                />
              )}

              <PasswordField
                identity="newPassword"
                translation={translations.newPasswordField}
                error={formikRestProps.errors.newPassword}
                dataCy="input:new-password"
              />

              <PasswordField
                identity="repeatedNewPassword"
                translation={translations.repeatedNewPasswordField}
                error={formikRestProps.errors.repeatedNewPassword}
                dataCy="input:repeated-new-password"
              />

              <Button
                variant="outlined"
                className="set-new-password__submit-btn"
                aria-label={translations.submitNewPassword}
                title={translations.submitNewPassword}
                data-cy="button:submit-new-password"
                type="submit"
              >
                {translations.submitNewPassword}
              </Button>
            </fieldset>
          </form>
        )}
      </Formik>

      <Popup {...popupData} />
    </section>
  );
}
SetNewPassword.CONTEXT_TYPES = Object.freeze({
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGED_IN: 'LOGGED_IN',
});

export { ResetPassword, SetNewPassword, PasswordField };
