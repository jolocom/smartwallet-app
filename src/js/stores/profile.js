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
    if (graphState.center) {
      this.state.centerNode = graphState.center.uri
    }
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

  _updateProfile(newData) {
    return this.wia.updateProfile(newData, this.state).then(resultState => {
      this.state = newData
    })
  },

  onUpdate(newData) {
    Promise.all([
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
