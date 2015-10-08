import Reflux from 'reflux'
import SearchActions from 'actions/search'

let filters = {
  where: true,
  what: true,
  who: true,
  when: true
}

export default Reflux.createStore({
  listenables: SearchActions,

  getInitialState() {
    return {
      visible: false,
      query: null,
      filters: filters
    }
  },

  onShow() {
    this.trigger({visible: true})
  },

  onHide() {
    this.trigger({visible: false})
  },

  onQuery(query) {
    this.trigger({query: query})
  },

  onReset() {
    this.trigger({query: null})
  },

  onToggleFilter(name) {
    filters[name] = !filters[name]
    this.trigger(filters)
  }
})
