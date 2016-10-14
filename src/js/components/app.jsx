import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {bankUri} from 'lib/fixtures'

import {Layout, Content} from 'components/layout'
import {
  Paper,
  AppBar,
  IconButton,
  Snackbar,
  FlatButton,
  Dialog} from 'material-ui'
import Badge from 'material-ui/Badge'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import JolocomTheme from 'styles/jolocom-theme'

import LeftNav from 'components/left-nav/nav.jsx'
import Profile from 'components/accounts/profile.jsx'
import Tour from 'components/tour.jsx'

import Loading from 'components/common/loading.jsx'

import AccountActions from 'actions/account'
import AccountStore from 'stores/account'
import ConfirmStore from 'stores/confirm'

import PinnedActions from 'actions/pinned'
import ConfirmActions from 'actions/confirm'
import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import SnackbarStore from 'stores/snackbar'

// A pathname is considered public if either "/" or if it starts
// with any of the following publicRoutes
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/change-password'
]

let App = React.createClass({

  mixins: [
    Reflux.connect(AccountStore, 'account'),
    Reflux.connect(ProfileStore, 'profile'),
    Reflux.connect(SnackbarStore, 'snackbar'),
    Reflux.connect(ConfirmStore, 'confirm')
  ],

  propTypes: {
    location: React.PropTypes.object,
    children: React.PropTypes.node,
    route: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    profile: React.PropTypes.any,
    account: React.PropTypes.object,
    username: React.PropTypes.string,
    searchActive: React.PropTypes.bool,
    location: React.PropTypes.object,
    route: React.PropTypes.object
  },

  getChildContext: function () {
    let {account, profile, searchActive} = this.state
    return {
      muiTheme: this.theme,
      profile,
      account,
      username: account && account.username, // backward compat
      searchActive,
      location: this.props.location,
      route: this.props.route
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
    AccountActions.login()
  },

  componentDidUpdate(prevProps, prevState) {
    let {username} = this.state.account

    if (prevState.account.username === undefined ||
      prevState.account.username !== username) {
      this.checkLogin()
    }
  },

  isPublicRoute(path = this.props.location.pathname) {
    return path === '/' ||
      publicRoutes.some((publicRoute) => path.indexOf(publicRoute) === 0)
  },

  checkLogin() {
    let {username, loggingIn} = this.state.account

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

  _handleConfirmClose() {
    ConfirmActions.close()
    this.state.confirm.callback()
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
        marginTop: '-20px',
        position: 'relative',
        top: '-4px',
        cursor: 'pointer'
      },
      hamburgerBadge: {
        top: 10,
        right: 20,
        width: 15,
        height: 15,
        display: 'none'
      }
    }
    return styles
  },

  render() {
    const styles = this.getStyles()

    // @TODO render login screen when logging in, also makes sures child
    // components don't get rendered before any user data is available
    if (this.state.account.loggingIn && !this.isPublicRoute()) {
      return <Loading />
    }

    // Deactivating search until we get it working
    /* <IconButton
       iconClassName="material-icons"
       iconStyle={styles.icon}
       onTouchTap={this._handleSearchTap}>search</IconButton> */
    const nav = (
      <div>
        <IconButton
          iconClassName="material-icons"
          iconStyle={styles.icon}
          onTouchTap={this._handleChatTap}>chat</IconButton>
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

    const confirmActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this._handleConfirmClose}
      />,
      <FlatButton
        label={this.state.confirm.primaryActionText}
        primary
        onTouchTap={this._handleConfirmClose}
      />
    ]

    return (
      <div style={styles.container}>
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
                    badgeStyle={styles.hamburgerBadge}>
                    <NavigationMenu
                      onTouchTap={this.showDrawer}
                      style={styles.menuIcon} />
                  </Badge>
                }
                onLeftIconButtonTouchTap={this.showDrawer} />
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
            <Profile />
            <Tour />
          </Layout>
        )}

        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          action={this.state.snackbar.undo && 'undo'}
          onActionTouchTap={this.state.snackbar.undoCallback}
        />

        <Dialog
          actions={confirmActions}
          modal={false}
          open={this.state.confirm.open}
          onRequestClose={this.handleClose}
        >
          {this.state.confirm.message}
        </Dialog>
      </div>

    )
  }

})

export default Radium(App)
