import React from 'react'
import Reflux from 'reflux'
import {History} from 'react-router'

import {Layout, Content} from 'components/layout'

import {Paper, AppBar, IconButton, IconMenu, MenuItem, Styles} from 'material-ui'

let {Colors} = Styles

import JolocomTheme from 'styles/jolocom-theme'

import SearchBar from 'components/common/search-bar.jsx'
// import LeftNav from 'components/left-nav/nav.jsx'
import Profile from 'components/accounts/profile.jsx'

import AppNav from 'components/nav.jsx'
import GraphSearch from 'components/graph/search.jsx'

import AvailabilityDevStore from 'stores/availability-dev'

import PinnedActions from 'actions/pinned'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

export default React.createClass({

  mixins: [
    History,
    Reflux.connect(AvailabilityDevStore),
    Reflux.connect(ProfileStore, 'profile')
  ],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    profile: React.PropTypes.any
  },

  getChildContext: function () {
    return {
      muiTheme: Styles.ThemeManager.getMuiTheme(JolocomTheme),
      profile: this.state.profile
    }
  },

  getInitialState() {
    return {
      searchActive: false,
      searchQuery: null
    }
  },

  componentWillMount() {
    ProfileActions.load()

    let path = this.props.location.pathname
    if (!this.state.signedUp && path !== 'signup') {
      this.history.pushState(null, '/signup')
    } else if (path === '/') {
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
            <IconButton iconClassName="material-icons" iconStyle={styles.icon} onTouchTap={this._handlePinnedTap}>inbox</IconButton>
          </div>
        ),
        search: <GraphSearch ref="search"/>
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

  _handleSearchHide() {
    this.setState({
      searchActive: false,
      searchQuery: null
    })
  },

  getStyles() {
    let styles = {
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
        color: Colors.white
      }
    }
    return styles
  },

  render() {
    let component = this.getComponent()
    let styles = this.getStyles()

    let search = component.search || <SearchBar ref="search" onChange={this._handleSearchChange} onHide={this._handleSearchHide}/>

    return (
      <div className="jlc-app">
        {this.state.signedUp ? (
          <Layout>
            <Paper zDept={1} style={styles.header}>
              <AppBar title="Jolocom" iconElementRight={component.nav} style={styles.bar}></AppBar>
              <AppNav activeTab={component.id} style={styles.nav}/>
              {search}
            </Paper>
            <Content>
              {React.Children.map(this.props.children, (el) => {
                return React.cloneElement(el, {
                  searchQuery: this.state.searchQuery
                })
              })}
            </Content>
            <Profile/>
          </Layout>
        ) : this.props.children}
      </div>
    )
  }

})
