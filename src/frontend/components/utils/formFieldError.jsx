import React from 'react';
import { PEVParagraph } from '@frontend/components/utils/pevElements';

export default function FormFieldError({ children, customMessage }) {
  return <PEVParagraph className="form-field-error">{customMessage || children}</PEVParagraph>;
}
