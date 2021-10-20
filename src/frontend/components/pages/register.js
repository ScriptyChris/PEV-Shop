import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { useHistory } from 'react-router-dom';
import apiService from '../../features/apiService';
import Popup, { POPUP_TYPES, getClosePopupBtn } from '../utils/popup';

const translations = Object.freeze({
  registerHeader: 'Account registration',
  logInField: 'Login',
  passwordField: 'Password',
  submitRegistration: 'Register!',
  email: 'Email',
  accountType: 'Account type',
  clientType: 'Client',
  retailerType: 'Retailer',
  emailSuccessMsg: `
    Account registered! 
    You need to confirm your account via the link we sent you on email, 
    before you'll be able to log in.
  `.trim(),
  emailFailureMsg: 'Failed to register new account :(',
  popupGoToLogin: 'Go to login',
});

export default function Register() {
  const [formInitials] = useState({
    login: '',
    password: '',
    email: '',
    accountType: '',
  });
  const [popupData, setPopupData] = useState(null);
  const history = useHistory();

  const onSubmitHandler = (values) => {
    console.log('register submit values:', values);

    apiService.registerUser(values).then((res) => {
      console.log('register res:', res, ' /typeof res:', typeof res);

      if (res.msg) {
        setPopupData({
          type: POPUP_TYPES.SUCCESS,
          message: translations.emailSuccessMsg,
          buttons: [
            {
              onClick: () => history.push('/log-in'),
              text: translations.popupGoToLogin,
            },
          ],
        });
      } else {
        setPopupData({
          type: POPUP_TYPES.FAILURE,
          message: translations.emailFailureMsg,
          buttons: [getClosePopupBtn(setPopupData)],
        });
      }
    });
  };

  return (
    <section>
      <Formik onSubmit={onSubmitHandler} initialValues={formInitials}>
        {({ handleSubmit /* ...formikRestProps */ }) => (
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                <h2>{translations.registerHeader}</h2>
              </legend>

              <div>
                <label htmlFor="registrationLogin">{translations.logInField}</label>
                <Field name="login" id="registrationLogin" required />
              </div>

              <div>
                <label htmlFor="registrationPassword">{translations.passwordField}</label>
                <Field
                  name="password"
                  id="registrationPassword"
                  type="password"
                  minLength="8"
                  maxLength="20"
                  required
                />
              </div>

              <div>
                <label htmlFor="registrationEmail">{translations.email}</label>
                <Field name="email" id="registrationEmail" type="email" required />
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

              <button type="submit">{translations.submitRegistration}</button>
            </fieldset>
          </form>
        )}
      </Formik>

      {popupData && <Popup {...popupData} />}
    </section>
  );
}
