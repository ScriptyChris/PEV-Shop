import React, { useState } from 'react';
import { Formik, Field } from 'formik';

const translations = Object.freeze({
  registerHeader: 'Account registration',
  logInField: 'Login',
  passwordField: 'Password',
  submitRegistration: 'Register!',
  email: 'Email',
  accountType: 'Account type',
  clientType: 'Client',
  retailerType: 'Retailer',
});

export default function Register() {
  const [formInitials] = useState({
    login: '',
    password: '',
    email: '',
    accountType: '',
  });

  const onSubmitHandler = (values) => {
    console.log('register submit values:', values);
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
                <Field name="password" id="registrationPassword" type="password" required />
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
    </section>
  );
}
