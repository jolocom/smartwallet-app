import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import GraphActions from 'actions/graph-actions'
import SnackbarActions from 'actions/snackbar'
import accountActions from '../actions/account'
import GraphAgent from 'lib/agents/graph'
import WebIDAgent from 'lib/agents/webid'
import GraphStore from 'stores/graph-store'

export default Reflux.createStore({
  listenables: ProfileActions,

  init() {
    this.state = {
      show: false,
      fullName: '',
      givenName: '',
      familyName: '',
      privacy: '',
      username: '',
      mobilePhone: '',
      email: '',
      address: '',
      socialMedia: '',
      profession: '',
      company: '',
      url: '',
      passportImgUri: '',
      passportNodeUri: '',
      creditCard: '',
      webId: '',
      imgUri: '',
      storage: '',
      centerNode: null
    }
    this.listenTo(accountActions.logout, this.onLogout)
    this.listenTo(GraphStore, this.graphChange)
    this.gAgent = new GraphAgent()
    this.wia = new WebIDAgent()
  },

  getInitialState () {
    return this.state
  },

  onLoad() {
    this.wia.getProfile()
      .then(ProfileActions.load.completed)
      .catch(ProfileActions.load.failed)
  },

  graphChange(graphState) {
    this.state.centerNode = graphState.center.uri
  },

  onLoadFailed() {
    SnackbarActions.showMessage('Failed to load the WebId profile info.')
  },

  onLoadCompleted(data) {
    this.state = Object.assign({}, this.state, data)
    this.trigger(data)
  },

  onLogout() {
    this.init()
  },

  _updatePassport(newData) {
    if (this.state.passportImgUri.trim() ===
      newData.passportImgUri.trim()) {
      return
    }
    const OldPassImgUri = this.state.passportImgUri.trim()
    const OldPassNodeUri = this.state.passportNodeUri.trim()
    // TODO These state modifcations could be a bit more explicit perhaps
    if (OldPassImgUri) {
      if (!newData.passportImgUri.trim()) {
        console.log(OldPassNodeUri)
        console.log(OldPassImgUri)

        this.state.passportImgUri = ''
        this.state.passportNodeUri = ''

        console.log(OldPassNodeUri)
        console.log(OldPassImgUri)

        return this.wia.deletePassport(OldPassNodeUri, OldPassImgUri)
      } else if (OldPassImgUri !== newData.passportImgUri.trim()) {
        this.state.passportImgUri = newData.passportImgUri
        return this.wia.updatePassport(
          OldPassNodeUri,
          OldPassImgUri,
          newData.passportImgUri
        )
      }
    } else if (newData.passportImgUri.trim()) {
      return this.gAgent.createNode(
        this.state.webId,
        {uri: this.state.webId, storage: this.state.storage},
        'Passport',
        undefined,
        newData.passportImgUri,
        'passport',
        true
      ).then((passportNodeUri) => {
        this.state.passportNodeUri = passportNodeUri
        this.state.passportImgUri = newData.passportImgUri
      })
    }
  },

  _updateProfile(newData) {
    return this.wia.updateProfile(newData, this.state).then(resultState => {
      this.state = newData
    })
  },

  onUpdate(newData) {
    Promise.all([
      this._updatePassport(newData, this.state),
      this._updateProfile(newData, this.state)
    ]).then(() => {
      if (this.state.centerNode === this.state.webId) {
        GraphActions.drawAtUri(this.state.centerNode, 0)
      }
      this.trigger(this.state)
    }).catch((error) => {
      console.log(error)
    })
  }
})
