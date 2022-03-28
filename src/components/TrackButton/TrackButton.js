import React, { useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'

const TrackButton = React.forwardRef((props, ref) => {
  const { component, children, to, trackType, ...restProps } = props
  const location = useLocation()
  const history = useHistory()
  const handleClick = useCallback(() => {
    if (trackType === 'push') {
      history.push(to, `${location.pathname}${location.search}`)
    } else {
      history.push(location.state || to)
    }
  }, [location, history, to, trackType])

  const Component = component || Button

  return (
    <Component {...restProps} ref={ref} onClick={handleClick}>
      {children}
    </Component>
  )
})

export default TrackButton
