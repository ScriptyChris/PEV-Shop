import React, { useState, useEffect } from 'react';
import { /* useHistory, */ useLocation } from 'react-router-dom';
import { Formik, Field } from 'formik';
import FormFieldError from '../utils/formFieldError';
import apiService from '../../features/apiService';

const translations = Object.freeze({
  resetPasswordHeader: 'Reset password',
  resettingEmailField: 'Email associated with user account',
  submitReset: 'Reset',
  setNewPasswordHeader: 'Set new password',
  newPasswordField: 'Password',
  repeatNewPasswordField: 'Repeat password',
  bothPasswordFieldsMustBeEqual: 'Both password fields must be equal!',
  submitNewPassword: 'Update password',
});

function ResetPassword() {
  console.log('(ResetPassword)');

  const [formInitials] = useState({
    email: '',
  });

  const onSubmitHandler = (values) => {
    apiService.resetPassword(values.email).then((res) => console.log('reset password res:', res));
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
    </section>
  );
}

function SetNewPassword() {
  const [token, setToken] = useState('');
  const [formInitials] = useState({
    newPassword: '',
    repeatedNewPassword: '',
  });
  //   const history = useHistory();
  const { search: searchParam } = useLocation();

  useEffect(() => {
    setToken(new URLSearchParams(searchParam).get('token'));
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
      apiService
        .updateUserAdHoc(
          {
            name: 'password',
            value: values.newPassword,
          },
          { name: 'resetPassword', value: token }
        )
        .then((res) => {
          console.log('(resetPassword) res?', res);

          // if ('isPasswordReset' in res) {
          //   setRegConfirmStatus(res.isPasswordReset ? RESET_CONFIRM_STATUS.SUCCEEDED : RESET_CONFIRM_STATUS.FAILED);
          // }
        });
    } /*  else {
        setRegConfirmStatus(REG_CONFIRM_STATUS.FAILED);
      } */
  };

  //   const logIn = () => history.push('/log-in');

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
                <label htmlFor="newPassword">{translations.passwordField}</label>
                {/* TODO: [UX] add feature to temporary preview (unmask) the password field */}
                <Field name="newPassword" id="newPassword" type="password" minLength="8" maxLength="20" required />

                {formikRestProps.errors.newPassword && (
                  <FormFieldError>{formikRestProps.errors.newPassword}</FormFieldError>
                )}
              </div>
              <div>
                <label htmlFor="repeatedNewPassword">{translations.repeatedPasswordField}</label>
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
    </section>
  );
}

export { ResetPassword, SetNewPassword };
