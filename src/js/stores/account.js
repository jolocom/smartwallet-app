import Reflux from 'reflux'
import AccountActions from 'actions/account'

let AccountStore = Reflux.createStore({
  listenables: AccountActions
})

export default AccountStore
