import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import accountActions from '../actions/account'
import GraphActions from 'actions/graph-actions'
import GraphStore from 'stores/graph-store'
import GraphAgent from 'lib/agents/graph'
import WebIDAgent from 'lib/agents/webid'

let defaultProfile = {
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
  bitcoinAddress: '',
  bitcoinAddressNodeUri: '',
  passportImgUri: '',
  passportImgNodeUri: '',
  webId: '#',
  creditCard: '',
  imgUri: null
}

let profile = Object.assign({}, defaultProfile)

export default Reflux.createStore({
  listenables: ProfileActions,

  init() {
    this.listenTo(accountActions.logout, this.onLogout)
    this.listenTo(GraphStore, this.graphUpdate)
    this.gAgent = new GraphAgent()
    this.wia = new WebIDAgent()
  },

  graphUpdate(data) {
    if (data && data.center) {
      profile.storage = data.center.storage
      profile.currentNode = data.center.uri
      this.trigger(Object.assign({}, profile))
    }
  },

  getInitialState () {
    return profile
  },

  onShow() {
    profile.show = true
    this.trigger(Object.assign({}, profile))
  },

  onHide() {
    profile.show = false
    this.trigger(Object.assign({}, profile))
  },

  onLoad() {
    this.wia.getProfile()
      .then(ProfileActions.load.completed)
      .catch(ProfileActions.load.failed)
  },

  onLoadFailed(err) {
    console.error('Failed loading webid profile', err)
  },

  // change state from triples
  onLoadCompleted(data) {
    this.trigger(Object.assign(profile, data))
  },

  onLogout() {
    profile = defaultProfile

    this.trigger(profile)
  },

  /* @summary Updates the rdf profile based on input
  /* @param {object} params - {familyName: ,givenName: ,email: ,imgUri: }
   */
  _updateBitcoin(params) {
    if (params.bitcoinAddress.trim() === profile.bitcoinAddress.trim()) {
      return
    }

    if (!params.bitcoinAddress.trim()) {
      return this.wia.deleteBitcoinAddress(params.bitcoinAddressNodeUri)
    } else if (!profile.bitcoinAddress.trim()) {
      return this.gAgent.createNode(
        GraphStore.state.user,
        GraphStore.state.center,
        'Bitcoin Address',
        params.bitcoinAddress,
        undefined,
        'default'
      ).then((bitcoinNode) => {
        profile.bitcoinAddressNodeUri = bitcoinNode.uri
        return this.wia.addBitcoinAddress(bitcoinNode.uri)
      })
    } else {
      return this.wia.updateBitcoinAddress(
        profile.bitcoinAddressNodeUri,
        params.bitcoinAddressNodeUri
      )
    }
  },

  _updatePassport(params) {
    if (profile.passportImgUri.trim()) {
      if (!params.passportImgUri.trim()) {
        return this.wia.deletePassport(
          profile.passportImgNodeUri,
          profile.passportImgUri
        )
      } else if (profile.passportImgUri.trim() !== params.passportImgUri.trim()
        ) {
        return this.wia.updatePassport(
          profile.passportImgNodeUri,
          profile.passportImgUri,
          params.passportImgUri
        )
      }
    } else if (params.passportImgUri.trim()) {
      return this.gAgent.createNode(
        GraphStore.state.user,
        GraphStore.state.center,
        'Passport',
        undefined,
        params.passportImgUri,
        'default',
        true
      ).then((passportNodeUri) => {
        profile.passportNodeUri = passportNodeUri
        return this.wia.addPassport(passportNodeUri)
      })
    }
  },

  _updateProfile(params) {
    return this.wia.updateProfile(params, profile).then((data) => {
      Object.assign(profile, data)
    })
  },

  onUpdate(params) {
    Promise.all([
      this._updateBitcoin(params),
      // this._updatePassport(params),
      this._updateProfile(params)
    ]).then(() => {
      if (params.currentNode) {
        GraphActions.drawAtUri(params.currentNode, 0)
      }

      this.trigger(profile)
    }).catch((error) => {
      console.log(error)
    })
  }
})
