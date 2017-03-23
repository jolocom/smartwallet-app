import theme from '../../styles/jolocom-theme'

export default {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
    padding: '16px',
    backgroundColor: theme.jolocom.gray4,
    boxSizing: 'border-box'
  },
  header: {
    margin: '40px 0 16px 0',
    color: theme.jolocom.gray1,
    fontSize: '18pt',
    fontWeight: '300'
  },
  sideNoteGray: {
    fontSize: '11px',
    fontWeight: '300',
    color: theme.jolocom.gray1
  },
  elementSpacing: {
    margin: '10px 0'
  },
  footer: {
    padding: '16px'
  }
}
