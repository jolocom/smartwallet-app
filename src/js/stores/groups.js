import Reflux from 'reflux'
import _ from 'lodash'
import GroupsActions from 'actions/groups'
import AccountStore from 'stores/account'
import {
  PRED
} from 'lib/namespaces'
import GraphAgent from 'lib/agents/graph'

export default Reflux.createStore({
  listenables: GroupsActions,

  getInitialState() {
    return {
      loading: false,
      items: []
    }
  },

  onLoad(query) {
    this.trigger({loading: true, items: []})
    new Promise(() => {
      this.trigger({loading: false, items: [{name: 'Group 1'},
                                            {name: 'Hroup 2'}]})
    })
  }
})
