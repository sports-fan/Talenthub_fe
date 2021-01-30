import React from 'react'
import { TextField, FormLabel } from '@material-ui/core'
import PropTypes from 'prop-types'
import useStyles from './styles'
import cn from 'classnames'
import * as R from 'ramda'

const FormInput = ({ type, field, form, field: { name }, htmlId, label, readOnly, noMb }) => {
  const classes = useStyles()
  const error = R.path(R.split('.', name), form.touched) && R.path(R.split('.', name), form.errors)

  return (
    <div className={cn(classes.wrapper, { [classes.noMb]: noMb })}>
      {label && <FormLabel htmlFor={htmlId}>{label}</FormLabel>}
      <TextField
        id={htmlId}
        margin="none"
        type={type}
        variant="outlined"
        fullWidth
        className={classes.textField}
        helperText={error || undefined}
        error={Boolean(error)}
        inputProps={
          readOnly
            ? {
                readOnly: true
              }
            : {}
        }
        {...field}
      />
    </div>
  )
}

FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  htmlId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

export default FormInput
