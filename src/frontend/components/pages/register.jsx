import React, { useState, useCallback } from 'react';

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {
  PEVForm,
  PEVButton,
  PEVHeading,
  PEVTextField,
  PEVFieldset,
  PEVLegend,
} from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { PasswordField } from '@frontend/components/views/password';

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
            dataCy: 'popup:user-successfully-registered',
            message: translations.registrationSuccessMsg,
            altMessage: translations.registrationSuccessAltMsg,
            singleAltBtn: {
              onClick: () => resendConfirmRegistration(values.email),
              text: translations.popupReSendEmail,
              dataCy: 'button:resend-register-email',
            },
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
      <PEVForm
        onSubmit={onSubmitHandler}
        validateOnChange={false}
        validate={formValidator}
        initialValues={formInitials}
      >
        {(formikProps) => (
          <PEVFieldset className="register__root-fieldset MuiFormControl-root">
            <PEVLegend className="register__header MuiFormLabel-root">
              <PEVHeading level={2}>{translations.registerHeader}</PEVHeading>
            </PEVLegend>

            <div className="register__login">
              <PEVTextField
                identity="registrationLogin"
                name="login"
                label={translations.logInField}
                required
                inputProps={{
                  'data-cy': 'input:register-login',
                }}
              />
            </div>

            <PasswordField
              identity="password"
              label={translations.passwordField}
              error={formikProps.errors.password}
              dataCy="input:register-password"
            />

            <PasswordField
              identity="repeatedPassword"
              label={translations.repeatedPasswordField}
              error={formikProps.errors.repeatedPassword}
              dataCy="input:register-repeated-password"
            />

            <div className="register__email">
              <PEVTextField
                type="email"
                identity="registrationEmail"
                name="email"
                label={translations.email}
                required
                inputProps={{ 'data-cy': 'input:register-email' }}
              />
            </div>

            <PEVFieldset>
              <PEVLegend>{translations.accountType}</PEVLegend>
              <RadioGroup
                className="register__account-types"
                aria-label={translations.accountType.toLowerCase()}
                name="accountType"
                value={formikProps.values.accountType}
                onChange={getAccountTypeChangeHandler(formikProps.setFieldValue)}
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
            </PEVFieldset>

            <PEVButton className="register__submit-button" type="submit" data-cy="button:submit-register">
              {translations.submitRegistration}
            </PEVButton>
          </PEVFieldset>
        )}
      </PEVForm>

      <Popup {...popupData} />
    </section>
  );
}
