import { makeStyles } from '@material-ui/styles'

export default makeStyles(theme => ({
  noItems: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  paper: {
    minWidth: 360
  },
  row: {
    marginBottom: theme.spacing(1)
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(1)
  },
  bottomAction: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}))
