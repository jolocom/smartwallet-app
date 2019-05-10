import React from 'react'
import {
  addNavigationHelpers,
  NavigationEventSubscription,
  NavigationEventCallback,
} from 'react-navigation'
import { connect } from 'react-redux'
import { BackHandler, Linking, StatusBar } from 'react-native'
import { AnyAction } from 'redux'
import { Routes } from 'src/routes'
import { RootState } from 'src/reducers/'
import { navigationActions, accountActions } from 'src/actions/'
import { BottomActionBar } from './ui/generic/'
import { routeList } from './routeList'
import { LoadingSpinner } from 'src/ui/generic/loadingSpinner'

const {
  createReduxBoundAddListener,
} = require('react-navigation-redux-helpers')

interface ConnectProps {
  navigation: RootState['navigation']
  openScanner: () => void
  goBack: () => void
  handleDeepLink: (url: string) => void
  checkIfAccountExists: () => void
}

interface OwnProps {
  dispatch: (action: AnyAction) => void
}

interface Props extends ConnectProps, OwnProps {
  deepLinkLoading: boolean
}

export class NavigatorContainer extends React.Component<Props> {
  private addListener: (
    name: string,
    cb: NavigationEventCallback,
  ) => NavigationEventSubscription

  constructor(props: Props) {
    super(props)
    this.addListener = createReduxBoundAddListener('root')
  }

  UNSAFE_componentWillMount() {
    Linking.getInitialURL().then((url: string) => {
      if (!url) {
        this.props.checkIfAccountExists()
      } else {
        this.props.handleDeepLink(url)
      }
    })

    Linking.addEventListener('url', this.handleOpenURL)
    BackHandler.addEventListener('hardwareBackPress', this.navigateBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack)
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  private navigateBack = () => {
    // return false if app exit is desired
    const { navigation } = this.props
    if (
      navigation.index === 0 &&
      navigation.routes.length === 1 &&
      navigation.routes[0].index === 0
    ) {
      return false
    }

    return this.props.goBack()
  }

  //When handleOpenURL is called, we pass the event url to the navigate method.
  private handleOpenURL = (event: any) => {
    this.props.handleDeepLink(event.url)
  }

  render() {
    const { routes, index } = this.props.navigation
    const currentRoute = routes[index].routeName
    return [
      <StatusBar barStyle="light-content" />,
      <Routes
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.navigation,
          addListener: this.addListener,
        })}
      />,
      this.props.deepLinkLoading && <LoadingSpinner />,
      currentRoute === routeList.Home && (
        <BottomActionBar openScanner={this.props.openScanner} />
      ),
    ]
  }
}

const mapStateToProps = (state: RootState) => ({
  navigation: state.navigation,
  deepLinkLoading: state.sso.deepLinkLoading,
})

const mapDispatchToProps = (dispatch: Function) => ({
  goBack: () => dispatch(navigationActions.goBack()),
  handleDeepLink: (url: string) =>
    dispatch(navigationActions.handleDeepLink(url)),
  openScanner: () =>
    dispatch(
      navigationActions.navigate({ routeName: routeList.QRCodeScanner }),
    ),
  checkIfAccountExists: () => dispatch(accountActions.checkIdentityExists()),
})

export const Navigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorContainer)
