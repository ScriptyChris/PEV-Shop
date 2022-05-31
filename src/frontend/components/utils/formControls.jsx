import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MUILink from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';

const useFieldsetStyles = makeStyles({
  root: {
    border: 'none',
  },
});

const FormikTextFieldForwarder = ({ field: _field, form, defaultValue, ...props }) => {
  const { value: fieldValue, ...field } = _field;
  const { value: propsValue, ...restProps } = props;
  const value = propsValue ?? fieldValue;
  const valueOrDefaultValue = {
    [defaultValue === null || defaultValue === undefined ? 'value' : 'defaultValue']: defaultValue ?? value,
  };

  return <TextField {...restProps} {...field} {...valueOrDefaultValue} />;
};

export const PEVButton = forwardRef(function PEVButton(props, ref) {
  if (!props.children) {
    throw ReferenceError('`children` prop must be provided!');
  }

  const a11y = props.a11y || props.children;

  if (typeof a11y === 'object') {
    throw TypeError('`a11y` or `children` prop must not be an object!');
  }

  return (
    <Button {...props} variant={props.variant || 'outlined'} aria-label={a11y} title={a11y} ref={ref}>
      {props.children}
    </Button>
  );
});

export const PEVIconButton = forwardRef(function PEVIconButton(props, ref) {
  if (!props.children) {
    throw ReferenceError('`children` prop must be provided!');
  }

  if (!props.a11y) {
    throw ReferenceError('`a11y` prop must be provided!');
  }

  return (
    <IconButton {...props} aria-label={props.a11y} title={props.a11y} ref={ref}>
      {props.children}
    </IconButton>
  );
});

export const PEVLink = forwardRef(function PEVLink({ children, ...restProps }, ref) {
  return (
    <MUILink {...restProps} component={Link} color="inherit" ref={ref}>
      {children}
    </MUILink>
  );
});

export const PEVFieldset = forwardRef(function PEVFieldset({ children, ...restProps }, ref) {
  return (
    <fieldset className={useFieldsetStyles().root} {...restProps} ref={ref}>
      {children}
    </fieldset>
  );
});

export const PEVLegend = forwardRef(function PEVLegend({ children, ...restProps }, ref) {
  return (
    <FormLabel {...restProps} component="legend" ref={ref}>
      {children}
    </FormLabel>
  );
});

export const PEVTextField = ({ identity, label, labelInside, type = 'text', ...restProps }) => {
  if (label === undefined) {
    throw Error('`label` has to be provided!');
  } else if (!identity) {
    throw Error('`identity` has to be provided!');
  }

  return (
    <>
      {!labelInside && <InputLabel htmlFor={identity}>{label}</InputLabel>}

      <Field
        component={FormikTextFieldForwarder}
        type={type}
        name={identity}
        id={identity}
        variant="outlined"
        size="small"
        {...(labelInside ? { label } : {})}
        {...restProps}
      />
    </>
  );
};

const PEVCheckboxOrRadio = forwardRef(function PEVCheckboxOrRadio(
  { type, label, value, noExplicitlyVisibleLabel, identity, field, form, ...restProps },
  ref
) {
  if (type !== 'checkbox' && type !== 'radio') {
    throw TypeError('`type` has to be either "checkbox" or "radio"!');
  } else if (!label) {
    throw Error('`label` has to be provided!');
  } else if (!field.name && !identity) {
    throw Error('Either `name` or `identity` has to be provided!');
  }

  const InputTag = type === 'checkbox' ? Checkbox : Radio;
  const name = field.name || identity;

  if (noExplicitlyVisibleLabel) {
    return (
      <InputTag
        {...restProps}
        {...field}
        name={name}
        inputProps={{
          'aria-label': label,
          title: label,
        }}
        ref={ref}
      />
    );
  }

  if (!identity) {
    throw Error('`identity` has to be provided!');
  }

  return (
    <>
      <InputTag {...restProps} {...field} name={name} id={identity} />
      <InputLabel htmlFor={identity}>{label}</InputLabel>
    </>
  );
});

export const PEVCheckbox = forwardRef(function PEVCheckbox(props, ref) {
  return <Field component={PEVCheckboxOrRadio} {...props} type="checkbox" ref={ref} />;
});

export const PEVRadio = forwardRef(function PEVRadio(props, ref) {
  return <Field component={PEVCheckboxOrRadio} {...props} type="radio" ref={ref} />;
});

export const PEVForm = forwardRef(function PEVForm({ initialValues = {}, children, overrideRenderFn, ...props }, ref) {
  // TODO: consider if providing `onSubmit` and `initialViews` is required or just optional
  const callStack = new Error().stack;
  const onSubmit = props.onSubmit || (() => console.log("Empty form's `onSubmit()`.\nCall stack:", { callStack }));

  if (!props.initialValues) {
    console.log("Empty form's `initialValues`.\nCall stack:", { callStack });
  }

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues} {...props} ref={ref}>
      {(formikProps) => {
        // TODO: [DX] remove it when `ProductsFilter` component's form will be refactored
        if (overrideRenderFn) {
          return overrideRenderFn(formikProps);
        }

        return <Form>{typeof children === 'function' ? children(formikProps) : children}</Form>;
      }}
    </Formik>
  );
});

export const PEVHeading = forwardRef(function PEVHeading({ level, children, ...restProps }, ref) {
  const isLevelANumberBetween1And6 = typeof level === 'number' && level >= 1 && level <= 6;

  if (!isLevelANumberBetween1And6) {
    throw TypeError('`level` prop has to be a number between 1 and 6!');
  }

  return (
    <Typography {...restProps} variant={`h${level}`} ref={ref}>
      {children}
    </Typography>
  );
});

export const PEVParagraph = forwardRef(function PEVParagraph({ children, ...restProps }, ref) {
  if (restProps.level) {
    throw Error('`level` prop is invalid for `PEVParagraph` component! Use `PEVHeading` component instead.');
  }

  return (
    <Typography {...restProps} variant="body1" ref={ref}>
      {children}
    </Typography>
  );
});
