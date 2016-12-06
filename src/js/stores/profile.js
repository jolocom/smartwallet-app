import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import GraphActions from 'actions/graph-actions'
import SnackbarActions from 'actions/snackbar'
import accountActions from '../actions/account'
import GraphAgent from 'lib/agents/graph'
import WebIDAgent from 'lib/agents/webid'

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
      passportImgNodeUri: '',
      creditCard: '',
      webId: '',
      imgUri: '',
      storage: '',
      centerNode: null
    }
    this.listenTo(accountActions.logout, this.onLogout)
    this.gAgent = new GraphAgent()
    this.wia = new WebIDAgent()
  },

  getInitialState () {
    return this.state
  },

  onLoad() {
    this.wia.getProfile()
      .then((da)=>{
        console.log(da,'da')
        ProfileActions.load.completed
      })
      .catch(ProfileActions.load.failed)
  },

  onLoadFailed() {
    SnackbarActions.showMessage('Failed to load the WebId profile info.')
  },

  onLoadCompleted(data) {
    this.state = Object.assign(this.state, data)
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

    if (OldPassImgUri) {
      if (!newData.passportImgUri.trim()) {
        return this.wia.deletePassport(OldPassImgUri, OldPassNodeUri)
      } else if (OldPassImgUri !== newData.passportImgUri.trim()) {
        return this.wia.updatePassport(
          OldPassNodeUri,
          OldPassImgUri,
          newData.passportImgUri
        )
      }
    } else if (newData.passportImgUri.trim()) {
      return this.gAgent.createNode(
        newData.webId,
        {uri: this.state.webid, storage: this.state.storage},
        'Passport',
        undefined,
        newData.passportImgUri,
        'default',
        true
      ).then((passportNodeUri) => {
        this.state.passportNodeUri = passportNodeUri
        return this.wia.addPassport(passportNodeUri)
      })
    }
  },

  _updateProfile(newData) {
    return this.wia.updateProfile(newData, this.state)
  },

  onUpdate(newData) {
    Promise.all([
      this._updatePassport(newData, this.state),
      this._updateProfile(newData, this.state)
    ]).then(() => {
      if (newData.currentNode) {
        GraphActions.drawAtUri(newData.currentNode, 0)
      }

      this.trigger(this.state)
    }).catch((error) => {
      console.log(error)
    })
  }
})
