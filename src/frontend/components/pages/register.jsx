import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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
  PEVParagraph,
} from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '@frontend/components/utils/popup';
import { PasswordField } from '@frontend/components/views/password';
import { ROUTES } from '@frontend/components/pages/_routes';

const translations = Object.freeze({
  registerHeader: 'Account registration',
  logInField: 'Login',
  passwordField: 'Password',
  repeatedPasswordField: 'Repeat password',
  submitRegistration: 'Register',
  email: 'Email',
  loadingAccountTypes: 'Loading account types...',
  accountType: 'Account type',
  clientType: 'Client',
  sellerType: 'Seller',
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
  const [accountTypes, setAccountTypes] = useState();
  const history = useHistory();

  useEffect(() => {
    httpService.getUserRoles().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      if (!Array.isArray(res) || !res.length) {
        // TODO: [UX] show error popup
        return;
      }

      setAccountTypes(
        res.map((userRoleName) => {
          const pascalCasedUserRoleName = userRoleName.replace(/./, (firstChar) => firstChar.toUpperCase());
          return {
            value: userRoleName,
            label: translations[`${userRoleName}Type`],
            identity: `registrationAccount${pascalCasedUserRoleName}Type`,
          };
        })
      );
    });
  }, []);

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
            buttons: [
              {
                onClick: redirectToLogInPage,
                text: translations.popupGoToLogin,
              },
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

  const redirectToLogInPage = () => history.replace(ROUTES.LOG_IN);

  // TODO: [PERFORMANCE] set some debounce to limit number of sent requests per time
  const resendConfirmRegistration = (email) => {
    httpService.resendConfirmRegistration(email);
  };

  return (
    <section className="register pev-fixed-container">
      <PEVForm
        onSubmit={onSubmitHandler}
        validateOnChange={false}
        validate={formValidator}
        initialValues={formInitials}
      >
        {(formikProps) => (
          <PEVFieldset className="register__root-fieldset pev-flex pev-flex--columned">
            <PEVLegend className="pev-centered-padded-text">
              <PEVHeading level={2}>{translations.registerHeader}</PEVHeading>
            </PEVLegend>

            <div className="pev-flex">
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

            <div className="pev-flex">
              <PEVTextField
                type="email"
                identity="registrationEmail"
                name="email"
                label={translations.email}
                required
                inputProps={{ 'data-cy': 'input:register-email' }}
              />
            </div>

            <div className="pev-flex" role="group">
              <PEVParagraph id="account-type-label">{translations.accountType}</PEVParagraph>
              <RadioGroup
                className="register__account-types"
                aria-labelledby="account-type-label"
                name="accountType"
                value={formikProps.values.accountType}
                onChange={getAccountTypeChangeHandler(formikProps.setFieldValue)}
              >
                {accountTypes
                  ? accountTypes.map((accountType) => (
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
                    ))
                  : translations.loadingAccountTypes}
              </RadioGroup>
            </div>

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
