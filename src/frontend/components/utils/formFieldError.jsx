import React from 'react';

export default function FormFieldError({ children, customMessage }) {
  return <p className="form-field-error">{customMessage || children}</p>;
}
