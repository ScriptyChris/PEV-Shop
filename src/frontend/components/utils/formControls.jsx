import React from 'react';
import TextField from '@material-ui/core/TextField';

export const FormikTextFieldForwarder = ({ field, ...props }) => <TextField {...props} {...field} />;
