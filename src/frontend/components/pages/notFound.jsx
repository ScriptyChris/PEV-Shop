import React from 'react';
import { useLocation } from 'react-router-dom';
import { PEVParagraph } from '@frontend/components/utils/pevElements';

const translations = Object.freeze({
  header: 'Page not found!',
  createCustomHeader(label, url) {
    if (label && url) {
      return (
        <PEVParagraph>
          Page for {label} with url <b>{url}</b> not found!
        </PEVParagraph>
      );
    }

    return '';
  },
});

export default function NotFound() {
  const { state } = useLocation();

  return translations.createCustomHeader(state.label, state.url) || translations.header;
}
