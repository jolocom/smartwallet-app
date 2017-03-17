import React from 'react'
import Reflux from 'reflux'
import { connect } from 'redux/utils'
import Radium, {StyleRoot} from 'radium'

import SnackbarContainer from 'components/snack-bar'
import ConfirmationDialog from 'components/confirmation-dialog'
import SimpleDialog from 'components/simple-dialog'

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import JolocomTheme from 'styles/jolocom-theme'

import LeftNav from 'components/left-nav/nav.jsx'
import Tour from 'components/tour'

import Loading from 'components/common/loading.jsx'

import ProfileActions from 'actions/profile'
import ProfileStore from 'stores/profile'

import {routes, publicRoutes} from 'routes'

let App = React.createClass({
  mixins: [
    Reflux.connect(ProfileStore, 'profile')
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
    let {profile, searchActive} = this.state
    let {account} = this.props

    return {
      muiTheme: getMuiTheme(JolocomTheme),
      profile,
      account,
      searchActive,
      location: this.props.location,
      route: this.props.route,
      router: this.context.router,
      store: this.context.store
    }
  },

  componentWillMount() {
    this.props.doLogin({})
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
    let {username, loggingIn} = this.props.account

    // session is still loading, so return for now
    if (username === undefined && loggingIn) {
      return
    }

    if (!username && !this.isPublicRoute()) {
      this.context.router.push(routes.login)
    } else if (username && this.isPublicRoute()) {
      this.context.router.push(routes.home)
    }

    if (username) {
      ProfileActions.load()
    }
  },

  getStyles() {
    let styles = {
      container: {
        width: '100%',
        height: '100%',
        position: 'relative'
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

    return (
      <StyleRoot style={styles.container}>
        {this.props.children}

        <LeftNav />
        <Tour />
        <SnackbarContainer />
        <ConfirmationDialog />
        <SimpleDialog />
      </StyleRoot>
    )
  }
})

export default connect({
  props: ['account'],
  actions: ['account:doLogin']
})(Radium(App))
