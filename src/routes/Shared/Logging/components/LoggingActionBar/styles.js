import { makeStyles } from '@material-ui/styles'

export default makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  },
  grid: {
    width: 'auto'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginRight: theme.spacing(4)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 40,
    textAlign: 'center'
  },
  userSelect: {
    display: 'flex',
    alignItems: 'left',
    padding: theme.spacing(3)
  },
  selectComponent: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    width: '30%'
  },
  pnButton: {
    paddingTop: theme.spacing(1)
  },
  datePick: {
    padding: theme.spacing(3)
  }
}))
