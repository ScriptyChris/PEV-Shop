/**
 * Facade over commonly used MUI and native HTML elements.
 * @module
 */
import '@frontend/assets/styles/views/pevElements.scss';

import React, { forwardRef, useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MUILink from '@material-ui/core/Link';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Skeleton from '@material-ui/lab/Skeleton';

import Scroller from '@frontend/components/utils/scroller';
import { useRWDLayout } from '@frontend/contexts/rwd-layout';
import { IMAGES_ROOT_PATH, COMMON_PERCEPTION_DELAY_TIME } from '@commons/consts';
import { MINOR_INFO_AUTO_CLOSE_TIME } from '@commons/consts';

const useFieldsetStyles = makeStyles({
  root: {
    border: 'none',
  },
});

const FormikTextFieldForwarder = ({ field: _field, form, defaultValue, ...props }) => {
  const { value: fieldValue, ...field } = _field;
  const { value: propsValue, overrideProps: { value: overridenValue, ...overrideProps } = {}, ...restProps } = props;
  const value = overridenValue ?? propsValue ?? fieldValue;
  const valueOrDefaultValue = {
    [defaultValue === null || defaultValue === undefined ? 'value' : 'defaultValue']: defaultValue ?? value,
  };

  return (
    <TextField
      className="pev-element-text-field-wrapper"
      {...restProps}
      {...field}
      {...overrideProps}
      {...valueOrDefaultValue}
    />
  );
};

export const PEVButton = forwardRef(function PEVButton({ children, ...props }, ref) {
  if (!children) {
    throw ReferenceError('`children` prop must be provided!');
  }

  const a11y = props.a11y || children;

  if (typeof a11y === 'object') {
    throw TypeError('`a11y` or `children` prop must not be an object!');
  }

  return (
    <Button {...props} variant={props.variant || 'outlined'} aria-label={a11y} title={a11y} ref={ref}>
      {children}
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

export const PEVLink = forwardRef(function PEVLink({ children, toExternalPage, ...restProps }, ref) {
  const externalPageAttrs = {
    target: '_blank',
    rel: 'noreferrer',
  };

  return (
    <MUILink color="inherit" {...restProps} component={Link} {...(toExternalPage && externalPageAttrs)} ref={ref}>
      {children}
    </MUILink>
  );
});

export const PEVFieldset = forwardRef(function PEVFieldset({ children, className, ...restProps }, ref) {
  return (
    <fieldset className={classNames(useFieldsetStyles().root, className)} {...restProps} ref={ref}>
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

export const PEVTextField = ({ identity, label, labelInside, type = 'text', onEnterKey, ...restProps }) => {
  if (label === undefined) {
    throw Error('`label` has to be provided!');
  } else if (!identity) {
    throw Error('`identity` has to be provided!');
  }

  const onKeyDown = ({ key }) => {
    if (key === 'Enter' && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  };

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
        onKeyDown={onKeyDown}
        {...(labelInside ? { label } : {})}
        {...restProps}
      />
    </>
  );
};

const PEVCheckboxOrRadio = forwardRef(function PEVCheckboxOrRadio(
  { type, label, value, noExplicitlyVisibleLabel, identity, field, form, dataCy, ...restProps },
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
          'data-cy': dataCy,
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

export const PEVForm = forwardRef(function PEVForm(
  { initialValues = {}, children, overrideRenderFn, className, id, dataCy, ...props },
  ref
) {
  // TODO: consider if providing `onSubmit` and `initialViews` is required or just optional
  // const callStack = new Error().stack;
  const onSubmit =
    props.onSubmit ||
    (() => {
      // console.log("Empty form's `onSubmit()`.\nCall stack:", { callStack });
    });

  // if (!props.initialValues) {
  //   console.log("Empty form's `initialValues`.\nCall stack:", { callStack });
  // }

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues} {...props} ref={ref}>
      {(formikProps) => {
        // TODO: [DX] remove it when `ProductsFilter` component's form will be refactored
        if (overrideRenderFn) {
          return overrideRenderFn({ ...formikProps, dataCy });
        }

        return (
          <Form id={id} className={className} data-cy={dataCy}>
            {typeof children === 'function' ? children(formikProps) : children}
          </Form>
        );
      }}
    </Formik>
  );
});

// TODO: [DX] use Formik's `<ErrorMessage>` component
export const PEVFormFieldError = ({ children, customMessage, ...restProps }) => {
  return (
    <PEVParagraph className="pev-element-form-field-error" {...restProps}>
      {customMessage || children}
    </PEVParagraph>
  );
};

export const PEVHeading = forwardRef(function PEVHeading({ level, children, withMargin, ...restProps }, ref) {
  const isLevelANumberBetween1And6 = typeof level === 'number' && level >= 1 && level <= 6;

  if (!isLevelANumberBetween1And6) {
    throw TypeError('`level` prop has to be a number between 1 and 6!');
  }

  return (
    <Typography {...restProps} variant={`h${level}`} ref={ref} style={{ margin: withMargin && '1rem' }}>
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

const setupTabs = (groupName, data) => {
  const createId = (tabPart, name) => `${groupName}-tab-${tabPart}__${name}`;
  const createA11yObj = (txt, relatedId) => ({
    'aria-label': txt,
    'aria-controls': relatedId,
    label: txt,
    title: txt,
  });

  return data.reduce(
    (output, { name, translation, icon, content, ribbon = {} }, index) => {
      output.tabChoosers.push({
        get id() {
          return createId('chooser', name);
        },
        get a11y() {
          return createA11yObj(translation, output.tabPanels[index].id);
        },
        name,
        icon,
        dataCy: `button:choose-${name}-tab`,
        ribbon,
      });
      output.tabPanels.push({
        content,
        get id() {
          return createId('panel', name);
        },
      });

      return output;
    },
    { tabChoosers: [], tabPanels: [] }
  );
};

export const PEVTabs = forwardRef(function PEVTabs(
  { config, label, prechosenTabValue = false, areChoosersScrollable, className, horizontalTabIcons },
  ref
) {
  const [tabValue, setTabValue] = useState(prechosenTabValue);
  const { tabChoosers, tabPanels } = useMemo(() => setupTabs(config.groupName, config.initialData), [config]);

  useEffect(() => setTabValue(prechosenTabValue), [prechosenTabValue]);

  const handleTabChange = (_, newTabValue) => {
    const tabChooser = tabChoosers[newTabValue];

    setTabValue(newTabValue);
    config.onTabChangeCallbacks?.forEach((callback) => callback(tabChooser));
  };

  const tabsElement = (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      variant="fullWidth"
      indicatorColor="primary"
      textColor="primary"
      aria-label={label}
      selectionFollowsFocus
    >
      {tabChoosers.map(({ id, icon, a11y, ribbon, dataCy }) => (
        <Tab
          className={classNames('pev-element-tabs__tab', {
            'pev-element-tabs__tab--with-ribbon': !!ribbon.transformer,
            'pev-element-tabs__tab--with-horizontal-icon': horizontalTabIcons,
          })}
          icon={icon}
          data-ribbon-value={ribbon.transformer?.(ribbon.value)}
          {...a11y}
          id={id}
          data-cy={dataCy}
          key={id}
        />
      ))}
    </Tabs>
  );

  return (
    <div ref={ref} className={className}>
      <div className="pev-element-tabs__chooser">
        {areChoosersScrollable ? (
          <Scroller
            scrollerBaseValueMeta={{
              useDefault: true,
            }}
            render={({ ScrollerHookingParent }) => <ScrollerHookingParent>{tabsElement}</ScrollerHookingParent>}
          />
        ) : (
          tabsElement
        )}
      </div>
      {tabPanels.map(({ content, id }, index) => (
        <div
          key={index}
          id={id}
          role="tabpanel"
          aria-labelledby={tabChoosers[index].id}
          hidden={tabValue !== index}
          data-cy={`container:${id}`}
        >
          {tabValue === index && <Box padding={1}>{content}</Box>}
        </div>
      ))}
    </div>
  );
});

export const PEVImage = forwardRef(function PEVImage(
  { image, src, alt, className = '', onLoad, onError, defaultHeightSameAsWidth, avoidLoader = false, ...restProps },
  ref
) {
  const { isMobileLayout } = useRWDLayout();
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const _onLoad = (event) => {
    setIsImgLoaded(true);
    onLoad?.(event);
  };
  const _onError = (event) => {
    setIsImgLoaded(true);
    onError?.(event);
  };

  if (image) {
    src = `/${IMAGES_ROOT_PATH}/${image.src}`;
    alt = image.name;
  } else if (!image && (!src || !alt)) {
    throw Error('When `image` prop is not provided, both `src` and `alt` must be provided!');
  }

  const imgDefaultWidth = isMobileLayout ? 300 : 500;
  const imgDefaultHeight = defaultHeightSameAsWidth ? imgDefaultWidth : null;
  const imgClassName = classNames('pev-element-image', className);
  const imgElem = (
    <img
      {...{
        width: imgDefaultWidth,
        height: imgDefaultHeight,
        ...restProps,
        src,
        alt,
        className: imgClassName,
        ref,
      }}
    />
  );
  const dummyImgElem = React.cloneElement(imgElem, {
    onLoad: _onLoad,
    onError: _onError,
  });

  return isImgLoaded || avoidLoader ? (
    imgElem
  ) : (
    <Skeleton variant="circle" className={imgClassName}>
      {dummyImgElem}
    </Skeleton>
  );
});

export const PEVPopover = forwardRef(function PEVPopover(
  { anchorSetterRef, shouldAutoClose = true, onClose = () => void 0, children, dataCy },
  ref
) {
  if (typeof anchorSetterRef !== 'object' || !('current' in anchorSetterRef)) {
    throw TypeError(
      `'anchorSetterRef' prop should be an object containing 'current' prop! Received "${anchorSetterRef}".`
    );
  } else if (typeof onClose !== 'function') {
    throw TypeError(`'onClose' prop should be a function! Received "${onClose}".`);
  } else if (!children) {
    throw TypeError(`'children' prop should be a truthy value! Received "${children}".`);
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpened = !!anchorEl;
  const autoCloseTimeoutIdRef = useRef(-1);
  const handleCloseConfirmation = () => {
    abortAutoClose();
    setAnchorEl(null);
    onClose();
  };
  const abortAutoClose = () => window.clearTimeout(autoCloseTimeoutIdRef.current);
  const scheduleAutoClose = () => {
    abortAutoClose();
    autoCloseTimeoutIdRef.current = window.setTimeout(handleCloseConfirmation, MINOR_INFO_AUTO_CLOSE_TIME);
  };

  useEffect(() => {
    // expose anchor setter to the parent, so it can toggle Popover from outside
    anchorSetterRef.current = setAnchorEl;
  }, []);

  useEffect(() => {
    if (shouldAutoClose && isOpened) {
      scheduleAutoClose();
    }
  }, [shouldAutoClose, isOpened, scheduleAutoClose, handleCloseConfirmation]);

  return (
    <Popover
      open={isOpened}
      anchorEl={anchorEl}
      onClose={handleCloseConfirmation}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      ref={ref}
      data-cy={dataCy}
    >
      <PEVParagraph className="pev-element-popover-content">{children}</PEVParagraph>
    </Popover>
  );
});

export function PEVLoadingAnimation({ emptyLoader, onUnmountedLoader, className, children }) {
  if (typeof onUnmountedLoader !== 'function' && onUnmountedLoader !== undefined) {
    throw TypeError(`'onUnmountedLoader' prop has to be a function or undefined! Received "${onUnmountedLoader}".`);
  } else if (children) {
    throw Error('"children" prop should not be passed!');
  }

  const [finishedLoadingDelay, setFinishedLoadingDelay] = useState(false);

  useEffect(() => {
    if (emptyLoader) {
      return () => onUnmountedLoader?.();
    }

    const loadingDelayTimeoutId = window.setTimeout(() => setFinishedLoadingDelay(true), COMMON_PERCEPTION_DELAY_TIME);

    return () => {
      window.clearTimeout(loadingDelayTimeoutId);
      onUnmountedLoader?.();
    };
  }, []);

  if (emptyLoader || !finishedLoadingDelay) {
    return null;
  }

  return <Skeleton variant="rect" className={classNames('pev-element-skeleton', className)} />;
}

export function PEVSuspense({ emptyLoader, onUnmountedLoader, children }) {
  return <Suspense fallback={<PEVLoadingAnimation {...{ emptyLoader, onUnmountedLoader }} />}>{children}</Suspense>;
}
