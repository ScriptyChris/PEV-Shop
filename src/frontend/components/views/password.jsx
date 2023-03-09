import '@frontend/assets/styles/views/password.scss';

import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import {
  PEVForm,
  PEVButton,
  PEVHeading,
  PEVTextField,
  PEVFieldset,
  PEVLegend,
  PEVFormFieldError,
} from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { ROUTES } from '@frontend/components/pages/_routes';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

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

function PasswordField({ identity, label, error, containerClassName, dataCy }) {
  if (!identity || !label) {
    throw ReferenceError(
      `'identity' and 'label' props must be non-empty! Received subsequently: '${identity}' and '${label}'`
    );
  }

  // TODO: [REFACTOR] take these values from some global config
  const [passwordMinLength, passwordMaxLength] = [8, 20];

  return (
    <div className={classNames('pev-flex', containerClassName)}>
      {/* TODO: [UX] add feature to temporary preview (unmask) the password field */}
      <PEVTextField
        type="password"
        identity={identity}
        label={label}
        inputProps={{
          minLength: passwordMinLength,
          maxLength: passwordMaxLength,
          'data-cy': dataCy,
        }}
        required
      />

      {error && <PEVFormFieldError>{error}</PEVFormFieldError>}
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
    <section className="reset-password pev-fixed-container">
      <PEVForm onSubmit={onSubmitHandler} initialValues={formInitials}>
        <PEVFieldset className="reset-password__root-fieldset">
          <PEVLegend className="pev-centered-padded-text">
            <PEVHeading level={2}>{translations.resetPasswordHeader}</PEVHeading>
          </PEVLegend>

          <div className="pev-flex">
            <PEVTextField
              type="email"
              identity="resettingEmail"
              name="email"
              label={translations.resettingEmailField}
              required
              inputProps={{ 'data-cy': 'input:reset-email' }}
            />
          </div>

          <PEVButton className="reset-password__submit-btn" type="submit" size="small" data-cy="button:submit-reset">
            {translations.submitReset}
          </PEVButton>
        </PEVFieldset>
      </PEVForm>

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
  const { isMobileLayout } = useRWDLayout();
  const columnDirectionedFlex = isMobileLayout ? 'pev-flex--columned' : '';

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
      <PEVForm
        onSubmit={onSubmitHandler}
        validateOnChange={false}
        validate={formValidator}
        initialValues={formInitials}
      >
        {(formikProps) => (
          <PEVFieldset className="pev-fixed-container pev-flex pev-flex--columned set-new-password__root-fieldset">
            <PEVLegend className="pev-centered-padded-text">
              <PEVHeading level={2}>{translations.setNewPasswordHeader}</PEVHeading>
            </PEVLegend>

            {contextType === SetNewPassword.CONTEXT_TYPES.LOGGED_IN && (
              <PasswordField
                identity="currentPassword"
                label={translations.currentPasswordField}
                error={formikProps.errors.currentPassword}
                containerClassName={columnDirectionedFlex}
              />
            )}

            <PasswordField
              identity="newPassword"
              label={translations.newPasswordField}
              error={formikProps.errors.newPassword}
              containerClassName={columnDirectionedFlex}
              dataCy="input:new-password"
            />

            <PasswordField
              identity="repeatedNewPassword"
              label={translations.repeatedNewPasswordField}
              error={formikProps.errors.repeatedNewPassword}
              containerClassName={columnDirectionedFlex}
              dataCy="input:repeated-new-password"
            />

            <PEVButton className="set-new-password__submit-btn" data-cy="button:submit-new-password" type="submit">
              {translations.submitNewPassword}
            </PEVButton>
          </PEVFieldset>
        )}
      </PEVForm>

      <Popup {...popupData} />
    </section>
  );
}
SetNewPassword.CONTEXT_TYPES = Object.freeze({
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGED_IN: 'LOGGED_IN',
});

export { ResetPassword, SetNewPassword, PasswordField };
