import '@frontend/assets/styles/views/welcome.scss';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import httpService from '@frontend/features/httpService';
import {
  PEVLoadingAnimation,
  PEVParagraph,
  PEVLink,
  PEVHeading,
  PEVButton,
} from '@frontend/components/utils/pevElements';
import { ROUTES } from '@frontend/components/pages/_routes';
import storageService from '@frontend/features/storageService';
import storeService from '@frontend/features/storeService';

const DISCLAIMER_FALLBACK_URL =
  'https://github.com/ScriptyChris/Fake-PEV-Shopping/tree/develop/src/frontend/assets/embedded/DISCLAIMER.html';
const USERS_CREDENTIALS_FALLBACK_URL =
  'https://github.com/ScriptyChris/Fake-PEV-Shopping/blob/develop/src/database/populate/initialData/users.json';
const APP_FEATURES_LIST = 'https://github.com/ScriptyChris/Fake-PEV-Shopping#1-features';
const APP_EMAIL_SERVICE_URL = 'https://github.com/ScriptyChris/Fake-PEV-Shopping#manual-email-service-setup';

const translations = {
  welcomeMessage: 'Welcome to PEV Shop!',
  featuresAndPreviewHeading: 'Features and preview',
  features1: 'This app offers many features, which are listed ',
  features1LinkLabel: 'in the docs',
  preview1: '. You can also ',
  preview1LinkLabel: 'watch there a preview of using the app',
  preview2: ', if you would like to receive some introduction.',
  periodicResetHeading: 'Automatic periodic reset',
  periodicResetReminder1: `In order to keep the app's state close to its initial form, whole database 
    is automatically reset at every full hour. This helps to present the app's content in a fairly clean shape 
    and shortens periods when the app may be unable to deliver some of its features (like if every product 
    was removed or sold out to users).`,
  periodicResetReminder2: `Before such reset occurs, you will be reminded with a regarding popup to let you 
    avoid being surprised. Afterwards, any actions you or other users did so far will be gone. 
    You then should see this "welcome" page again and you will be able to resume interacting with the app from the beginning.`,
  disclaimerHeading: 'Usage disclaimer',
  disclaimerFallback: 'Could not fetch the disclaimer content. You can read it on ',
  disclaimerFallbackSuffix: "the app's repository page.",
  testUsersCredentialsHeading: 'Test users',
  testUsersCredentials: `The app contains a few test users (client and seller), on which you can log in with 
    the following credentials (login / password):`,
  testUsersCredentialsFallback: 'Could not fetch test users credentials. You can check them in ',
  testUsersCredentialsFallbackSuffix: "the app's repository.",
  usingAsGuest: `You can also use the app without being logged in. In such case, some features (like observing and 
    buying products or adding new ones) will be unavailable.`,
  emailsServiceHeading: 'Built-in email service',
  emailsService1: `The app exposes `,
  emailsService1LinkLabel: `simple email service`,
  emailsService2: `, which handles receiving every email sent by the app 
    (e.g. during the account registration process). Link to the email service is provided inside user's 
    profile menu (located in the app's navigation top bar).`,
  emailsService3: `Any email address you type inside the app's 
    conforming form will be set as a receiver and you will be able to read that email in the mentioned service. 
    Because that service is public and doesn't require to login, every user is able to read every email.`,
  continueToApp: 'Continue to the app',
};

const getDisclaimerContent = (disclaimerMessage) => {
  let disclaimerContent = <PEVParagraph dangerouslySetInnerHTML={{ __html: disclaimerMessage }} />;

  if (disclaimerMessage === null) {
    disclaimerContent = (
      <>
        {translations.disclaimerFallback}
        <PEVLink to={{ pathname: DISCLAIMER_FALLBACK_URL }} underline="always" toExternalPage>
          {translations.disclaimerFallbackSuffix}
        </PEVLink>
      </>
    );
  } else if (disclaimerMessage === '') {
    disclaimerContent = <PEVLoadingAnimation />;
  }

  return disclaimerContent;
};
const getTestUsersCredentials = (testUsersCredentials) => {
  let testUsersCredentialsContent = (
    <ul className="welcome__default-users-credentials">
      {testUsersCredentials?.map(({ login, password }) => (
        <li key={login}>
          <span>
            &quot;{login}&quot;
            <ArrowRightAltIcon />
            &quot;{password}&quot;
          </span>
        </li>
      ))}
    </ul>
  );

  if (testUsersCredentials === null) {
    testUsersCredentialsContent = (
      <PEVParagraph className="welcome__default-users-credentials--fallback">
        {translations.testUsersCredentialsFallback}
        <PEVLink to={{ pathname: USERS_CREDENTIALS_FALLBACK_URL }} underline="always" toExternalPage>
          {translations.testUsersCredentialsFallbackSuffix}
        </PEVLink>
      </PEVParagraph>
    );
  } else if (!testUsersCredentials?.length) {
    testUsersCredentialsContent = <PEVLoadingAnimation />;
  }

  return testUsersCredentialsContent;
};

export default function Welcome({ useAppReloadCountdown, remainingTimestampToNextAppReset }) {
  const [disclaimerMessage, setDisclaimerMessage] = useState(null);
  const [testUsersCredentials, setTestUsersCredentials] = useState(null);
  const [shouldReloadApp, setShouldReloadApp] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let _isComponentMounted = true;
    document.documentElement.style.overflow = 'hidden';

    storageService.clearAllUserData();
    storeService.clearAllUserData();
    const welcomeTimestamp = Date.now();
    storageService.recentWelcomeVisitTimestamp.update(welcomeTimestamp);

    setDisclaimerMessage('');
    setTestUsersCredentials([]);
    httpService
      .getWelcomePageData()
      .then((res) => {
        if (res.__EXCEPTION_ALREADY_HANDLED || !_isComponentMounted) {
          return;
        }

        const { disclaimer, testUsersCredentials } = res;

        setDisclaimerMessage(disclaimer || null);
        setTestUsersCredentials(testUsersCredentials || null);
      })
      .catch(() => {
        setDisclaimerMessage(null);
        setTestUsersCredentials(null);
      });

    return () => {
      _isComponentMounted = false;
      document.documentElement.style.overflow = null;
    };
  }, []);

  const handleContinueToApp = () => history.replace(ROUTES.ROOT);
  const switchContinueBtnToReloadBtn = () => setShouldReloadApp(true);
  const [remainingTimeToAppNextReset, setRemainingTimeToAppNextReset] = useState();
  const { handleReloadAppRef, reloadAppTranslation } = useAppReloadCountdown({
    onCountdownTick: setRemainingTimeToAppNextReset,
    onFinishedCountdown: switchContinueBtnToReloadBtn,
    timestampDiff: remainingTimestampToNextAppReset,
  });

  const disclaimerContent = getDisclaimerContent(disclaimerMessage);
  const testUsersCredentialsContent = getTestUsersCredentials(testUsersCredentials);

  return (
    <div className="welcome-container">
      <article className="welcome pev-fixed-container pev-flex pev-flex--columned">
        <PEVHeading level={2} className="pev-centered-padded-text">
          {translations.welcomeMessage}
        </PEVHeading>

        <section className="pev-flex pev-flex--columned">
          <PEVHeading level={3}>
            <strong>{translations.featuresAndPreviewHeading}</strong>
          </PEVHeading>
          <PEVParagraph>
            {translations.features1}
            <PEVLink to={{ pathname: APP_FEATURES_LIST }} underline="always" toExternalPage>
              {translations.features1LinkLabel}
            </PEVLink>
            {translations.preview1}
            <PEVLink to={{ pathname: '' }} underline="always" toExternalPage>
              {translations.preview1LinkLabel}
            </PEVLink>
            {translations.preview2}
          </PEVParagraph>
        </section>

        <section className="pev-flex pev-flex--columned">
          <PEVHeading level={3}>
            <strong>{translations.disclaimerHeading}</strong>
          </PEVHeading>
          <div className="welcome__disclaimer">{disclaimerContent}</div>
        </section>

        <section className="pev-flex pev-flex--columned">
          <PEVHeading level={3}>
            <strong>{translations.testUsersCredentialsHeading}</strong>
          </PEVHeading>
          <PEVParagraph>{translations.testUsersCredentials}</PEVParagraph>
          {testUsersCredentialsContent}
          <PEVParagraph>{translations.usingAsGuest}</PEVParagraph>
        </section>

        <section className="pev-flex pev-flex--columned">
          <PEVHeading level={3}>
            <strong>{translations.emailsServiceHeading}</strong>
          </PEVHeading>
          <PEVParagraph>
            {translations.emailsService1}
            <PEVLink to={{ pathname: APP_EMAIL_SERVICE_URL }} underline="always" toExternalPage>
              {translations.emailsService1LinkLabel}
            </PEVLink>
            {translations.emailsService2}
          </PEVParagraph>
          <PEVParagraph>{translations.emailsService3}</PEVParagraph>
        </section>

        <section className="pev-flex pev-flex--columned">
          <PEVHeading level={3}>
            <strong>{translations.periodicResetHeading}</strong>
          </PEVHeading>
          <PEVParagraph>{translations.periodicResetReminder1}</PEVParagraph>
          <PEVParagraph>{translations.periodicResetReminder2}</PEVParagraph>
          <PEVParagraph>{remainingTimeToAppNextReset}</PEVParagraph>
        </section>

        {shouldReloadApp ? (
          <PEVButton className="welcome__reload-app" onClick={handleReloadAppRef.current}>
            {reloadAppTranslation}
          </PEVButton>
        ) : (
          <PEVButton className="welcome__continue-to-app" onClick={handleContinueToApp}>
            {translations.continueToApp}
          </PEVButton>
        )}
      </article>
    </div>
  );
}
