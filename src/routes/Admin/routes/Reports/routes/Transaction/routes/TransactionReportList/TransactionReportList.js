import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Formik } from 'formik'
import { show } from 'redux-modal'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import DateRangePickerForm, { validationSchema } from 'components/DateRangePickerForm'
import Widget from 'components/Widget'
import TransactionTable from 'components/TransactionTable'
import SimpleSelect from 'components/SimpleSelect'
import Spinner from 'components/Spinner'
import { getTeams, teamsSelector } from 'store/modules/team'
import useStyles from './styles'
import { getTransactions, transactionsSelector, transactionsLoadingSelector } from 'store/modules/transaction'
import { meSelector } from 'store/modules/auth'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { ListDataType } from 'helpers/prop-types'
import { parseQueryString, jsonToQueryString } from 'helpers/utils'
import { periodOptions, FINANCIALREQUEST_TYPE_OPTIONS, FINANCIALREQUEST_TYPE } from 'config/constants'

const TransactionReportList = ({
  getTransactions,
  transactions,
  isTransactionLoading,
  me,
  teams,
  getTeams,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
  location,
  history
}) => {
  const queryObj = useMemo(
    () => ({
      period: 'this-month',
      ...parseQueryString(location.search)
    }),
    [location.search]
  )

  const initialShowCustom = queryObj.period === 'custom' ? 1 : 0
  const initialValues = {
    from: queryObj.from || null,
    to: queryObj.to || null
  }
  const [showCustom, setShowCustom] = useState(initialShowCustom)
  const classes = useStyles()

  useEffect(() => {
    getTeams()
  }, [getTeams])

  useEffect(() => {
    const { type = 'all', from, to, team = 'all', period } = queryObj
    if (!from && period !== 'custom') {
      getTransactions({
        me,
        params: {
          ...pagination,
          period,
          team: team === 'all' ? undefined : team,
          type: type === 'all' ? undefined : type
        }
      })
    }
    if (from && to) {
      getTransactions({
        me,
        params: {
          ...pagination,
          period,
          team: team === 'all' ? undefined : team,
          type: type === 'all' ? undefined : type,
          from,
          to
        }
      })
    }
  }, [getTransactions, me, pagination, queryObj])

  const teamOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...(teams
        ? teams.map(team => ({
            value: team.id.toString(),
            label: team.name
          }))
        : [])
    ],
    [teams]
  )

  const financialRequestTypeOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...FINANCIALREQUEST_TYPE_OPTIONS.filter(typeOption => typeOption.value !== FINANCIALREQUEST_TYPE.SENDINVOICE)
    ],
    []
  )

  const handleTeamChange = useCallback(
    event => {
      const { type, period, from, to } = queryObj
      const team = event.target.value
      if (team !== 'all') {
        history.push({
          search: jsonToQueryString({
            type,
            period,
            team,
            from,
            to
          })
        })
      } else {
        history.push({
          search: jsonToQueryString({
            period
          })
        })
      }
    },
    [history, queryObj]
  )

  const handleTypeChange = useCallback(
    event => {
      const { team, period, from, to } = queryObj
      const type = event.target.value
      if (type !== 'all') {
        history.push({
          search: jsonToQueryString({
            type,
            team,
            period,
            from,
            to
          })
        })
      } else {
        history.push({
          search: jsonToQueryString({
            period
          })
        })
      }
    },
    [history, queryObj]
  )

  const handlePeriodChange = useCallback(
    event => {
      const { type, team, page, page_size } = queryObj
      const period = event.target.value
      if (period !== 'custom') {
        setShowCustom(0)
        history.push({
          search: jsonToQueryString({
            type,
            team,
            period,
            page,
            page_size
          })
        })
      } else {
        setShowCustom(1)
        history.push({
          search: jsonToQueryString({
            type,
            period,
            team
          })
        })
      }
    },
    [history, queryObj]
  )

  const handleSubmit = useCallback(
    (formValues, formActions) => {
      if (!formValues.from || !formValues.to) {
        return
      } else {
        const { page, page_size } = queryObj
        history.push({
          search: jsonToQueryString({
            period: 'custom',
            from: formValues.from,
            to: formValues.to,
            page,
            page_size
          })
        })
      }
    },
    [history, queryObj]
  )

  if (isTransactionLoading) return <Spinner />
  else
    return transactions ? (
      <>
        <Grid container>
          <Grid item xs={12}>
            <Widget
              title="Transactions"
              disableWidgetMenu
              WidgetButton={
                <Grid container spacing={2} alignItems="stretch" justify="flex-end">
                  <Grid item>
                    <SimpleSelect
                      label="Type"
                      value={queryObj.type || 'all'}
                      options={financialRequestTypeOptions}
                      onChange={handleTypeChange}
                    />
                  </Grid>
                  <Grid item>
                    <SimpleSelect
                      label="Period"
                      value={queryObj.period}
                      options={periodOptions}
                      onChange={handlePeriodChange}
                    />
                  </Grid>
                  <Grid item>
                    <SimpleSelect
                      label="Team"
                      value={queryObj.team || 'all'}
                      options={teamOptions}
                      onChange={handleTeamChange}
                    />
                  </Grid>
                </Grid>
              }>
              {showCustom ? (
                <div className={classes.dateRangeFilter}>
                  <Formik
                    component={DateRangePickerForm}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                  />
                </div>
              ) : null}
              <TransactionTable
                data={transactions}
                me={me}
                pagination={pagination}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
              />
            </Widget>
          </Grid>
        </Grid>
      </>
    ) : null
}

const actions = {
  getTransactions,
  getTeams,
  show
}

const selector = createStructuredSelector({
  transactions: transactionsSelector,
  isTransactionLoading: transactionsLoadingSelector,
  me: meSelector,
  teams: teamsSelector
})

TransactionReportList.propTypes = {
  getTransactions: PropTypes.func.isRequired,
  transactions: ListDataType,
  isTransactionLoading: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired,
  show: PropTypes.func.isRequired,
  pagination: PropTypes.object,
  teams: PropTypes.array
}

export default compose(withRouter, withPaginationInfo, connect(selector, actions))(TransactionReportList)
