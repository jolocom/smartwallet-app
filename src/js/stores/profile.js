import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import GraphActions from 'actions/graph-actions'
import SnackbarActions from 'actions/snackbar'
import accountActions from '../actions/account'
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
    this.gAgent = new GraphAgent()
    this.wia = new WebIDAgent()
  },

  getInitialState () {
    return profile
  },

  onLoad() {
    this.wia.getProfile()
      .then(ProfileActions.load.completed)
      .catch(ProfileActions.load.failed)
  },

  onLoadFailed() {
    SnackbarActions.showMessage('Failed to load the WebId profile info.')
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
        profile.webId,
        {uri: profile.webId, storage: profile.storage},
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
        profile.webId,
        {uri: profile.webId, storage: profile.storage},
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
      // this._updateBitcoin(params),
      this._updatePassport(params),
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
