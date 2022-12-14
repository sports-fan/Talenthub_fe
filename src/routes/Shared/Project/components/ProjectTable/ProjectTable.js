import React, { useCallback, useMemo } from 'react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import cn from 'classnames'
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Tooltip,
  IconButton
} from '@material-ui/core'
import PropTypes from 'prop-types'

import { ROLES, PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS, URL_PREFIXES } from 'config/constants'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import useStyles from './styles'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName } from 'helpers/utils'
import { meSelector } from 'store/modules/auth'

function ProjectTable({
  me,
  data,
  role,
  onDelete,
  history,
  location,
  disableActions,
  pagination,
  onChangePage,
  onChangeRowsPerPage
}) {
  const classes = useStyles()
  const columns = useMemo(() => {
    function getColumns(role, disableActions) {
      let columns = ['Title', 'Type', 'Weekly Limit', 'Price', 'Status']
      if ([ROLES.ADMIN, ROLES.TEAM_MANAGER].includes(role)) columns.push('Project Starter')
      if (!disableActions) columns.push('Actions')
      return columns
    }

    return getColumns(role, disableActions)
  }, [role, disableActions])

  const showProjectDetail = useCallback(
    id => () => {
      location.state
        ? history.push(location.state, `${location.state}${location.search}`)
        : history.push(
            `/${URL_PREFIXES[me.role]}/projects/${id}/edit`,
            `/${URL_PREFIXES[me.role]}/projects${location.search}`
          )
    },
    [history, location, me]
  )

  if (data) {
    const { results } = data
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
          {results.map(({ id, title, type, weekly_limit, price, status, project_starter }) => (
            <TableRow
              key={id}
              hover
              className={cn({ [classes.tableRow]: disableActions })}
              onClick={disableActions ? showProjectDetail(id) : undefined}>
              <TableCell>{title}</TableCell>
              <TableCell>{PROJECT_TYPE_LABELS[type]}</TableCell>
              <TableCell>{weekly_limit}</TableCell>
              <TableCell>{price}</TableCell>
              <TableCell>{PROJECT_STATUS_LABELS[status]}</TableCell>
              {[ROLES.ADMIN, ROLES.TEAM_MANAGER].includes(role) ? (
                <TableCell>{getAsianFullName(project_starter)}</TableCell>
              ) : null}
              {!disableActions && (
                <TableCell className={classes.action}>
                  <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                    <TrackButton
                      component={IconButton}
                      trackType="push"
                      to={`/${URL_PREFIXES[me.role]}/projects/${id}/edit`}>
                      <EditIcon color="primary" />
                    </TrackButton>
                  </Tooltip>
                  <Tooltip key={`${id}Delete`} title="Delete" placement="top">
                    <IconButton onClick={() => onDelete(id)}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        {!disableActions && (
          <TableFooter>
            <TableRow>
              <TablePagination //This pagination is zero-based.
                rowsPerPageOptions={[2, 5, 10, 25]}
                count={data.count}
                rowsPerPage={pagination.page_size}
                page={pagination.page - 1}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    )
  } else {
    return <Spinner />
  }
}

const selector = createStructuredSelector({
  me: meSelector
})

ProjectTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
  history: PropTypes.object.isRequired,
  disableActions: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired
}

ProjectTable.defaultProps = {
  disableActions: false
}

export default compose(withRouter, connect(selector))(ProjectTable)
