import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {History} from 'react-router'
import {bankUri} from 'lib/fixtures'

import {Layout, Content} from 'components/layout'
import {Paper, AppBar, IconButton, IconMenu, MenuItem} from 'material-ui'

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import JolocomTheme from 'styles/jolocom-theme'

import SearchBar from 'components/common/search-bar.jsx'
import LeftNav from 'components/left-nav/nav.jsx'
import Profile from 'components/accounts/profile.jsx'
import Tour from 'components/tour.jsx'

import AppNav from 'components/nav.jsx'
import GraphSearch from 'components/graph/search.jsx'

import AccountActions from 'actions/account'
import AccountStore from 'stores/account'

import PinnedActions from 'actions/pinned'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

let App = React.createClass({

  mixins: [
    History,
    Reflux.connect(AccountStore, 'account'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    profile: React.PropTypes.any,
    username: React.PropTypes.string
  },

  getChildContext: function () {
    let {account, profile} = this.state
    return {
      muiTheme: getMuiTheme(JolocomTheme),
      profile: profile,
      username: account && account.username
    }
  },

  getInitialState() {
    return {
      searchActive: false,
      searchQuery: null
    }
  },

  componentWillMount() {
    this.checkLogin()
  },

  componentDidMount() {
    AccountActions.checkSession()
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.account.username !== this.state.account.username) {
      this.checkLogin()
    }
  },

  checkLogin() {
    let path = this.props.location.pathname
    let {username} = this.state.account

    // session is still loading, so return for now
    if (username === undefined) {
      return
    }
    console.log(path)
    if (!username && path !== '/signup' && path !== '/login' && path !== '/') {
      this.history.pushState(null, '/login')
    } else if (username && (path === '/signup' || path === '/login')) {
      ProfileActions.load(username)
      this.history.pushState(null, '/graph')
    }
  },

  getComponent() {
    let path = this.props.location.pathname
    let styles = this.getStyles()

    if (path.match('/graph')) {
      return {
        id: 'graph',
        title: 'Graph',
        nav: (
          <div>
            <IconButton iconClassName="material-icons" iconStyle={styles.icon} onTouchTap={this._handleSearchTap}>search</IconButton>
          </div>
        ),
        search: <GraphSearch ref="search" onChange={this._handleSearchChange} onSubmit={this._handleSearchSubmit} onHide={this._handleSearchHide}/>
      }

    } else if (path.match('/chat')) {
      return {
        id: 'chat',
        title: 'Chat',
        nav: (
          <div>
            <IconButton iconClassName="material-icons" iconStyle={styles.icon} onTouchTap={this._handleSearchTap}>search</IconButton>
          </div>
        )
      }

    } else if (path.match('/contacts')) {
      return {
        id: 'contacts',
        title: 'Contacts',
        nav: (
          <div>
            <IconButton iconClassName="material-icons" iconStyle={styles.icon} onTouchTap={this._handleSearchTap}>search</IconButton>
            <IconMenu iconButtonElement={<IconButton iconClassName="material-icons" iconStyle={styles.icon}>more_vert</IconButton>}>
              <MenuItem primaryText="Invite a friend" index={0} />
            </IconMenu>
          </div>
        )
      }
    }

    return {}
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
        zIndex: 5
      },
      bar: {
        boxShadow: 'none'
      },
      nav: {
        display: this.state.searchActive ? 'none' : 'block'
      },
      icon: {
        color: '#ffffff'
      }
    }
    return styles
  },

  render() {
    let component = this.getComponent()
    let styles = this.getStyles()
    let search = component.search || <SearchBar ref="search" onChange={this._handleSearchChange} onHide={this._handleSearchHide}/>

    return (
      <div style={styles.container}>
        {this.state.account.username ? (
          <Layout>
            <Paper zDept={1} style={styles.header}>
              <AppBar title="Jolocom" iconElementRight={component.nav} style={styles.bar} onLeftIconButtonTouchTap={this.showDrawer}></AppBar>
              <AppNav activeTab={component.id} style={styles.nav}/>
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
        ) : this.props.children}
      </div>
    )
  }

})

export default Radium(App)
