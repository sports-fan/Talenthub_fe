import React, { useEffect, useCallback } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Grid } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { show } from 'redux-modal'
import PropTypes from 'prop-types'

import { getPartners, deletePartnerAndRefresh, partnersSelector, partnersLoadingSelector } from 'store/modules/partner'
import { meSelector } from 'store/modules/auth'
import { URL_PREFIXES } from 'config/constants'
import PartnerTable from '../../components/PartnerTable'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import Widget from 'components/Widget'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { ListDataType } from 'helpers/prop-types'

const PartnerList = ({
  getPartners,
  deletePartnerAndRefresh,
  partners,
  isPartnersLoading,
  me,
  show,
  location,
  history,
  pagination,
  onChangePage,
  onChangeRowsPerPage
}) => {
  useEffect(() => {
    getPartners({
      me: me,
      params: pagination
    })
  }, [getPartners, me, pagination])

  const handleDelete = useCallback(
    id => {
      deletePartnerAndRefresh({
        id,
        role: me.role,
        message: 'Are you sure to delete this partner?'
      })
    },
    [me, deletePartnerAndRefresh]
  )

  if (isPartnersLoading) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget
            title="Partners"
            disableWidgetMenu
            WidgetButton={
              <TrackButton trackType="push" color="primary" to={`/${URL_PREFIXES[me.role]}/partners/new`}>
                Add a Partner
              </TrackButton>
            }>
            <PartnerTable
              data={partners}
              role={me.role}
              handleDelete={handleDelete}
              pagination={pagination}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </Widget>
        </Grid>
      </Grid>
    )
}

const actions = {
  getPartners,
  deletePartnerAndRefresh,
  show
}

const selectors = createStructuredSelector({
  partners: partnersSelector,
  isPartnersLoading: partnersLoadingSelector,
  me: meSelector
})

PartnerList.propTypes = {
  getPartners: PropTypes.func.isRequired,
  deletePartnerAndRefresh: PropTypes.func.isRequired,
  partners: ListDataType,
  isPartnersLoading: PropTypes.bool.isRequired,
  me: PropTypes.object,
  show: PropTypes.func.isRequired,
  pagination: PropTypes.object
}

export default compose(withPaginationInfo, withRouter, connect(selectors, actions))(PartnerList)
