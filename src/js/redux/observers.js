// import {setWebId} from './modules/account'
import {setAttributeVerified} from './modules/wallet/identity'

export default function setup({store, services}) {
  // services.auth.on('changed', (webId = null) => {
  //   store.dispatch(setWebId(webId))
  // })
  // if (services.auth.currentUser) {
  //   const webId = services.auth.currentUser.wallet.webId || null
  //   services.auth.emit('changed', webId)
  // }

  services.auth.on('verification.stored', ({attrType, attrId}) => {
    store.dispatch(setAttributeVerified(attrType, attrId, true))
  })
}
