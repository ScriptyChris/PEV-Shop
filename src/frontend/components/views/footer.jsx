import React from 'react';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import { PEVLink, PEVParagraph } from '@frontend/components/utils/pevElements';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';

const translations = {
  sourceCodePrefix: "App's",
  sourceCode: 'source code',
  productsDataDisclaimerPrefix: 'Products data based on',
  engineIconPrefix: 'Engine icon',
  engineIconMidPart: 'icon by',
};

export default function Footer() {
  const { isMobileLayout } = useRWDLayout();
  const linkSharedProps = {
    target: '_blank',
    rel: 'noreferrer',
    color: 'inherit',
    underline: 'always',
  };
  const dividerElem = <Divider orientation={isMobileLayout ? 'horizontal' : 'vertical'} flexItem={!isMobileLayout} />;

  return (
    <Paper
      component="footer"
      elevation={4}
      className={classNames('footer pev-flex', { 'pev-flex--columned': isMobileLayout })}
    >
      <PEVParagraph>
        {translations.sourceCodePrefix}{' '}
        <PEVLink to={{ pathname: 'https://github.com/ScriptyChris/Fake-PEV-Shopping' }} {...linkSharedProps}>
          {translations.sourceCode}
        </PEVLink>
      </PEVParagraph>

      {dividerElem}

      <PEVParagraph>
        {translations.productsDataDisclaimerPrefix}{' '}
        <PEVLink to={{ pathname: 'https://www.ewheels.com/shop/' }} {...linkSharedProps}>
          eWheels.com
        </PEVLink>
      </PEVParagraph>

      {dividerElem}

      <PEVParagraph>
        <PEVLink to={{ pathname: 'https://icons8.com/icons/set/engine' }} {...linkSharedProps}>
          {translations.engineIconPrefix}
        </PEVLink>{' '}
        {translations.engineIconMidPart}{' '}
        <PEVLink to={{ pathname: 'https://icons8.com' }} {...linkSharedProps}>
          Icons8
        </PEVLink>
      </PEVParagraph>
    </Paper>
  );
}
