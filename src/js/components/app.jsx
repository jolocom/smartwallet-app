import React from 'react'
import Reflux from 'reflux'
import { connect } from 'redux/utils'
import Radium, {StyleRoot} from 'radium'
import {bankUri} from 'lib/fixtures'

import {Layout, Content} from 'components/layout'
import {
  Paper,
  AppBar,
  IconButton,
  Badge
} from 'material-ui'
import SnackbarContainer from 'components/snack-bar'
import ConfirmationDialog from 'components/confirmation-dialog'

import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import JolocomTheme from 'styles/jolocom-theme'

import LeftNav from 'components/left-nav/nav.jsx'
import Tour from 'components/tour'

import Loading from 'components/common/loading.jsx'

import PinnedActions from 'actions/pinned'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import UnreadMessagesActions from 'actions/unread-messages'
import UnreadMessagesStore from 'stores/unread-messages'

// A pathname is considered public if either "/" or if it starts
// with any of the following publicRoutes
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/change-password',
  '/privacy-settings',
  '/shared-nodes',
  '/node-list',
  '/verify-email',
  '/add-contacts'
]

let App = React.createClass({

  mixins: [
    Reflux.connect(ProfileStore, 'profile'),
    Reflux.connect(UnreadMessagesStore, 'unreadMessages')
  ],

  propTypes: {
    location: React.PropTypes.object,
    children: React.PropTypes.node,
    route: React.PropTypes.object,
    account: React.PropTypes.object.isRequired,
    doLogin: React.PropTypes.func.isRequired
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    profile: React.PropTypes.any,
    account: React.PropTypes.object,
    username: React.PropTypes.string,
    searchActive: React.PropTypes.bool,
    location: React.PropTypes.object,
    route: React.PropTypes.object,
    router: React.PropTypes.object,
    store: React.PropTypes.object
  },

  getChildContext: function () {
    let {account, profile, searchActive} = this.state
    console.log({
      muiTheme: this.theme,
      profile,
      account,
      username: account && account.username, // backward compat
      searchActive,
      location: this.props.location,
      route: this.props.route,
      router: this.context.router,
      store: this.context.store
    })
    return {
      muiTheme: this.theme,
      profile,
      account,
      username: account && account.username, // backward compat
      searchActive,
      location: this.props.location,
      route: this.props.route,
      router: this.context.router,
      store: this.context.store
    }
  },

  getInitialState() {
    return {
      searchActive: false,
      searchQuery: null,
      showIndicator: false
    }
  },

  componentWillMount() {
    this.theme = getMuiTheme(JolocomTheme)
    this.props.doLogin({})
  },

  componentWillUnmount() {
    const webId = this.props.account
    if (webId) {
      UnreadMessagesActions.unsubscribe(webId)
    }
  },

  componentDidUpdate(prevProps, prevState) {
    let {username} = this.props.account

    if (prevProps.account.username === undefined ||
      prevProps.account.username !== username) {
      this.checkLogin()
    }
  },

  isPublicRoute(path = this.props.location.pathname) {
    return path === '/' ||
      publicRoutes.some((publicRoute) => path.indexOf(publicRoute) === 0)
  },

  checkLogin() {
    let {username, loggingIn, webId} = this.props.account

    // session is still loading, so return for now
    if (username === undefined && loggingIn) {
      return
    }

    if (!username && !this.isPublicRoute()) {
      this.context.router.push('/login')
    } else if (username && this.isPublicRoute()) {
      this.context.router.push('/graph')
    }

    if (username) {
      ProfileActions.load()
      UnreadMessagesActions.load(webId, true)
    }
  },

  getUnreadCount() {
    const {unreadMessages} = this.state
    return unreadMessages && unreadMessages.items &&
      unreadMessages.items.length || 0
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
    this.context.router.push(`/graph/${encodeURIComponent(uri)}`)
    this.refs.search.hide()
  },

  _handleSearchHide() {
    this.setState({
      searchActive: false,
      searchQuery: null
    })
  },

  _handleChatTap() {
    this.context.router.push('/conversations')
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
      },
      menuIcon: {
        cursor: 'pointer'
      },
      navBadge: {
        padding: 0
      },
      hamburgerBadge: {
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        display: 'none'
      },
      chatBadge: {
        display: this.getUnreadCount() ? 'flex' : 'none'
      }
    }
    return styles
  },

  render() {
    const styles = this.getStyles()
    // @TODO render login screen when logging in, also makes sures child
    // components don't get rendered before any user data is available
    if (this.props.account.loggingIn && !this.isPublicRoute()) {
      return <Loading />
    }

    // Deactivating search until we get it working
    /*
    <IconButton
      iconClassName="material-icons"
      iconStyle={styles.icon}
      onTouchTap={this._handleSearchTap}>search</IconButton>
    */
    const nav = (
      <div>
        <Badge
          badgeContent={this.getUnreadCount()}
          secondary
          style={styles.navBadge}
          badgeStyle={styles.chatBadge}
        >
          <IconButton
            iconClassName="material-icons"
            iconStyle={styles.icon}
            onTouchTap={this._handleChatTap}>chat</IconButton>
        </Badge>
      </div>
    )

    // Deactivating search until we get it working
    /*
    (
      <GraphSearch
        ref="search"
        onChange={this._handleSearchChange}
        onSubmit={this._handleSearchSubmit}
        onHide={this._handleSearchHide} />
    )
    */
    const search = null

    // Deactivating the filters until we get them working
    // <GraphFilters style={styles.filters} showDefaults />
    const filters = null

    return (
      <StyleRoot style={styles.container}>
        {this.isPublicRoute() ? this.props.children : (
          <Layout>
            <Paper style={styles.header}>
              <AppBar
                title="Graph"
                iconElementRight={nav}
                style={styles.bar}
                iconElementLeft={
                  <Badge
                    badgeContent={''}
                    secondary
                    style={styles.navBadge}
                    badgeStyle={styles.hamburgerBadge}>
                    <IconButton
                      onTouchTap={this.showDrawer}
                    >
                      <NavigationMenu
                        onTouchTap={this.showDrawer}
                        style={styles.menuIcon} />
                    </IconButton>
                  </Badge>
                } />
              {filters}
              {search}
            </Paper>
            <LeftNav ref="leftNav" />
            <Content>
              { /* TODO: Nuke this, because this is not
              the right way to do things */ }
              {React.Children.map(this.props.children, (el) => {
                return React.cloneElement(el, {
                  searchQuery: this.state.searchQuery
                })
              })}
            </Content>
            <Tour />
          </Layout>
        )}

        <SnackbarContainer />
        <ConfirmationDialog />
      </StyleRoot>
    )
  }

})

export default Radium(connect({
  props: ['account'],
  actions: ['account:doLogin']
})(App))
