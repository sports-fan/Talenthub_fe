import React, { useCallback } from 'react'
import { Table, TableRow, TableHead, TableBody, TableCell, Button } from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { compose } from 'redux'

import Spinner from 'components/Spinner'
import { ListDataType } from 'helpers/prop-types'
import { URL_PREFIXES } from 'config/constants'
import { getAsianFullName } from 'helpers/utils'
import useStyles from './styles'

const columns = ['Full name', 'Plan', 'Achievements', 'Action']

function LogsTable({ data, history, location, match: { path }, role, interval }) {
  const classes = useStyles()
  const handleRowClick = useCallback(
    id => e => {
      e.preventDefault()
      history.push(`/${URL_PREFIXES[role]}/logging/${interval}/${id}/detail`, `${location.pathname}${location.search}`)
    },
    [location, history, interval, role]
  )

  if (data) {
    return (
      <Table className="mb-0">
        <TableHead>
          <TableRow>
            {columns.map(key => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.results.map(({ id, owner, plan, achievements }) => (
            <TableRow key={id} hover>
              <TableCell className={classes.item}>{getAsianFullName(owner)}</TableCell>
              <TableCell className={classes.content}>
                <pre className={classes.text}>{plan}</pre>
              </TableCell>
              <TableCell className={classes.content}>
                <pre className={classes.text}>{achievements}</pre>
              </TableCell>
              <TableCell className={classes.item}>
                <Button
                  component={Link}
                  to={`${path}/${id}`}
                  onClick={handleRowClick(id)}
                  variant="text"
                  color="primary">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } else {
    return <Spinner />
  }
}

LogsTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired
}

export default compose(withRouter)(LogsTable)
