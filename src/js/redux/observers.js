import {setWebId} from './modules/account'

export default function setup({store, services}) {
  services.auth.on('changed', (user) => {
    store.dispatch(setWebId(user.wallet.webId))
  })
}
