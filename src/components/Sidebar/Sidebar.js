import React, { useState, useEffect } from 'react'
import { Drawer, IconButton, List } from '@material-ui/core'
import {
  Dashboard as DashboardIcon,
  ArrowBack as ArrowBackIcon,
  Group as UserIcon,
  GroupWork as TeamIcon,
  Face as ProfileIcon,
  AccountCircle as AccountIcon,
  WorkOutline as ClientIcon,
  AccessibilityNew as PartnerIcon,
  Computer as ProjectIcon,
  ContactPhone as FRIcon,
  Loop as TransactionIcon
} from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'

// styles
import useStyles from './styles'

// components
import SidebarLink from './components/SidebarLink/SidebarLink'

// context
import { useLayoutState, useLayoutDispatch, toggleSidebar } from 'context/LayoutContext'

import { ROLES } from 'config/constants'
import { meSelector } from 'store/modules/auth'

let structure = {
  [ROLES.ADMIN]: [
    {
      id: 0,
      label: 'Dashboard',
      link: `/admin/dashboard`,
      icon: <DashboardIcon />
    },
    {
      id: 1,
      label: 'Users',
      link: `/admin/users`,
      icon: <UserIcon />
    },
    {
      id: 2,
      label: 'Teams',
      link: `/admin/teams`,
      icon: <TeamIcon />
    },
    {
      id: 3,
      label: 'Profiles',
      link: `/admin/profiles`,
      icon: <ProfileIcon />
    },
    {
      id: 4,
      label: 'Accounts',
      link: `/admin/accounts`,
      icon: <AccountIcon />
    },
    {
      id: 5,
      label: 'Partners',
      link: '/admin/partners',
      icon: <PartnerIcon />
    },
    {
      id: 6,
      label: 'Clients',
      link: '/admin/clients',
      icon: <ClientIcon />
    },
    {
      id: 7,
      label: 'Projects',
      link: '/admin/projects',
      icon: <ProjectIcon />
    },
    {
      id: 8,
      label: 'Financial Requests',
      link: '/admin/financial-requests',
      icon: <FRIcon />
    },
    {
      id: 9,
      label: 'Transaction',
      link: '/admin/transactions',
      icon: <TransactionIcon />
    }
  ],
  [ROLES.TEAM_MANAGER]: [
    {
      id: 0,
      label: 'Dashboard',
      link: `/team-manager/dashboard`,
      icon: <DashboardIcon />
    },
    {
      id: 1,
      label: 'Users',
      link: `/team-manager/users`,
      icon: <UserIcon />
    },
    {
      id: 2,
      label: 'Profiles',
      link: `/team-manager/profiles`,
      icon: <ProfileIcon />
    },
    {
      id: 3,
      label: 'Accounts',
      link: `/team-manager/accounts`,
      icon: <AccountIcon />
    },
    {
      id: 4,
      label: 'Partners',
      link: '/team-manager/partners',
      icon: <PartnerIcon />
    },
    {
      id: 5,
      label: 'Clients',
      link: '/team-manager/clients',
      icon: <ClientIcon />
    },
    {
      id: 6,
      label: 'Projects',
      link: '/team-manager/projects',
      icon: <ProjectIcon />
    },
    {
      id: 7,
      label: 'Financial Requests',
      link: '/team-manager/financial-requests',
      icon: <FRIcon />
    },
    {
      id: 8,
      label: 'Transaction',
      link: '/team-manager/transactions',
      icon: <TransactionIcon />
    }
  ],
  [ROLES.DEVELOPER]: [
    {
      id: 0,
      label: 'Dashboard',
      link: `/developer/dashboard`,
      icon: <DashboardIcon />
    },
    {
      id: 1,
      label: 'Profiles',
      link: `/developer/profiles`,
      icon: <ProfileIcon />
    },
    {
      id: 2,
      label: 'Accounts',
      link: `/developer/accounts`,
      icon: <AccountIcon />
    },
    {
      id: 3,
      label: 'Clients',
      link: '/developer/clients',
      icon: <ClientIcon />
    },
    {
      id: 4,
      label: 'Partners',
      link: '/developer/partners',
      icon: <PartnerIcon />
    },
    {
      id: 5,
      label: 'Projects',
      link: '/developer/projects',
      icon: <ProjectIcon />
    },
    {
      id: 6,
      label: 'Financial Requests',
      link: '/developer/financial-requests',
      icon: <FRIcon />
    },
    {
      id: 7,
      label: 'Transaction',
      link: '/developer/transactions',
      icon: <TransactionIcon />
    }
  ]
}

function Sidebar({ location, me }) {
  var classes = useStyles()
  var theme = useTheme()

  // global
  var { isSidebarOpened } = useLayoutState()
  var layoutDispatch = useLayoutDispatch()

  // local
  var [isPermanent, setPermanent] = useState(true)

  useEffect(function() {
    window.addEventListener('resize', handleWindowWidthChange)
    handleWindowWidthChange()
    return function cleanup() {
      window.removeEventListener('resize', handleWindowWidthChange)
    }
  })

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened
        })
      }}
      open={isSidebarOpened}>
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse)
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure[me.role].map(link => (
          <SidebarLink key={link.id} location={location} isSidebarOpened={isSidebarOpened} {...link} />
        ))}
      </List>
    </Drawer>
  )

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth
    var breakpointWidth = theme.breakpoints.values.md
    var isSmallScreen = windowWidth < breakpointWidth

    if (isSmallScreen && isPermanent) {
      setPermanent(false)
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true)
    }
  }
}

const selectors = createStructuredSelector({
  me: meSelector
})

Sidebar.propTypes = {
  location: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired
}

export default R.compose(
  withRouter,
  connect(selectors)
)(Sidebar)
