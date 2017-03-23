import Theme from '../../styles/jolocom-theme'

export default {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
    padding: '5%',
    backgroundColor: Theme.jolocom.gray4
  },
  header: {
    // marginTop: '40px',
    // marginBottom: '30px',
    color: Theme.jolocom.gray1,
    fontSize: '18pt',
    fontWeight: '300'
  },
  sideNoteGray: {
    fontSize: '11pt',
    fontWeight: '300',
    color: Theme.jolocom.gray1
  },
  elementSpacing: {
    margin: '10px 0'
  }
}
