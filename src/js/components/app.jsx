import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import includes from 'lodash/includes'
import {History} from 'react-router'
import {bankUri} from 'lib/fixtures'

import {Layout, Content} from 'components/layout'
import {Paper, AppBar, IconButton} from 'material-ui'

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import JolocomTheme from 'styles/jolocom-theme'

import LeftNav from 'components/left-nav/nav.jsx'
import Profile from 'components/accounts/profile.jsx'
import Tour from 'components/tour.jsx'

import GraphSearch from 'components/graph/search.jsx'
import GraphFilters from 'components/graph/filters.jsx'

import AccountStore from 'stores/account'

import PinnedActions from 'actions/pinned'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

const publicRoutes =  ['/', '/login', '/signup']

let App = React.createClass({

  mixins: [
    History,
    Reflux.connect(AccountStore, 'account'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    profile: React.PropTypes.any,
    username: React.PropTypes.string,
    searchActive: React.PropTypes.boolean
  },

  getChildContext: function () {
    let {account, profile, searchActive} = this.state
    return {
      muiTheme: this.theme,
      profile: profile,
      username: account && account.username,
      searchActive
    }
  },

  getInitialState() {
    return {
      searchActive: false,
      searchQuery: null
    }
  },

  componentWillMount() {
    this.theme = getMuiTheme(JolocomTheme)
    this.checkLogin()
  },

  componentDidUpdate(prevProps, prevState) {
    let {username} = this.state.account

    if (prevState.account.username !== username) {
      this.checkLogin()
    }
  },

  isPublicRoute(path) {
    return includes(publicRoutes, path || this.props.location.pathname)
  },

  checkLogin() {
    let {username} = this.state.account

    // session is still loading, so return for now
    if (username === undefined) {
      return
    }

    if (!username && !this.isPublicRoute()) {
      this.history.pushState(null, '/login')
    } else if (username && this.isPublicRoute()) {
      this.history.pushState(null, '/graph')
    }

    if (username) {
      ProfileActions.load()
    }
  },

  _handlePinnedTap() {
    PinnedActions.show()
  },

  _handleSearchTap() {
    this.refs.search.show()
    this.setState({searchActive: true})
  },

  _handleSearchChange(query) {
    this.setState({searchQuery: query})
  },

  _handleSearchSubmit() {
    let uri = `${bankUri}/${this.state.searchQuery}#this`
    this.history.pushState(null, `/graph/${encodeURIComponent(uri)}`)
    this.refs.search.hide()
  },

  _handleSearchHide() {
    this.setState({
      searchActive: false,
      searchQuery: null
    })
  },

  _handleChatTap() {
    this.history.pushState(null, '/chat')
  },

  showDrawer() {
    this.refs.leftNav.show()
  },

  getStyles() {
    let styles = {
      container: {
        width: '100%',
        height: '100%',
        position: 'relative'
      },
      header: {
        zIndex: 5,
        backgroundColor: this.theme.appBar.color
      },
      bar: {
        boxShadow: 'none'
      },
      nav: {
        display: this.state.searchActive ? 'none' : 'block'
      },
      icon: {
        color: this.theme.appBar.textColor
      },
      filters: {
        width: '100%',
        height: '48px'
      }
    }
    return styles
  },

  render() {
    const styles = this.getStyles()
    const nav = (
      <div>
        <IconButton iconClassName="material-icons" iconStyle={styles.icon} onTouchTap={this._handleSearchTap}>search</IconButton>
        <IconButton iconClassName="material-icons" iconStyle={styles.icon} onTouchTap={this._handleChatTap}>chat</IconButton>
      </div>
    )
    const search = <GraphSearch ref="search" onChange={this._handleSearchChange} onSubmit={this._handleSearchSubmit} onHide={this._handleSearchHide}/>
    const filters = <GraphFilters style={styles.filters} showDefaults={true}/>

    return (
      <div style={styles.container}>
        {this.isPublicRoute() ? this.props.children : (
          <Layout>
            <Paper zDept={1} style={styles.header}>
              <AppBar title="Graph" iconElementRight={nav} style={styles.bar} onLeftIconButtonTouchTap={this.showDrawer}></AppBar>
              {filters}
              {search}
            </Paper>
            <LeftNav ref="leftNav" />
            <Content>
              {React.Children.map(this.props.children, (el) => {
                return React.cloneElement(el, {
                  searchQuery: this.state.searchQuery
                })
              })}
            </Content>
            <Profile/>
            <Tour/>
          </Layout>
        )}
      </div>
    )
  }

})

export default Radium(App)
