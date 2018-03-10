import React from 'react'
import { connect } from 'redux_state/utils'
import PropTypes from 'prop-types'
import Radium, {StyleRoot} from 'radium'

import ConfirmationDialog from 'components/confirmation-dialog'
import SimpleDialog from 'components/simple-dialog'

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import JolocomTheme from 'styles/jolocom-theme'

// import LeftNav from 'components/left-nav/nav.jsx'

import Loading from 'components/common/loading.jsx'

import {routes, publicRoutes} from 'routes'

class App extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.node,
    route: PropTypes.object,
    account: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  static childContextTypes = {
    muiTheme: PropTypes.object,
    profile: PropTypes.any,
    account: PropTypes.object,
    username: PropTypes.string,
    searchActive: PropTypes.bool,
    location: PropTypes.object,
    route: PropTypes.object,
    router: PropTypes.object,
    store: PropTypes.object
  };

  getChildContext() {
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
  }

  componentWillMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    let {username} = this.props.account

    if (prevProps.account.username === undefined ||
      prevProps.account.username !== username) {
      // this.checkLogin()
    }
  }

  isPublicRoute = (path = this.props.location.pathname) => {
    return path === '/' ||
      publicRoutes.some((publicRoute) => path.indexOf(publicRoute) === 0)
  };

  checkLogin = () => {
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
  };

  getStyles = () => {
    let styles = {
      container: {
        width: '100%',
        height: '100%',
        position: 'relative'
      }
    }
    return styles
  };

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

        <ConfirmationDialog />
        <SimpleDialog />
      </StyleRoot>
    )
  }
}

export default connect({
  props: ['account']
})(Radium(App))
