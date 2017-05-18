import {setWebId} from './modules/account'

export default function setup({store, services}) {
  services.auth.on('changed', webId => {
    store.dispatch(setWebId(webId))
  })
  services.auth.emit('changed', services.auth.currentUser.wallet.webId || null)
}
