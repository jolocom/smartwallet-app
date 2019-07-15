import React from 'react'
import { connect } from 'react-redux'
import { BackHandler, Linking, StatusBar } from 'react-native'
import { RootState } from 'src/reducers/'
import { navigationActions, accountActions, genericActions } from 'src/actions/'
import { routeList } from './routeList'
import { LoadingSpinner } from 'src/ui/generic/loadingSpinner'
import { ThunkDispatch } from './store'
import { handleDeepLink } from './actions/navigation'
import { toggleLoading } from './actions/account'
import { RoutesContainer } from './routes'
import { withErrorHandling, withLoading } from './actions/modifiers'
import { showErrorScreen } from './actions/generic'

import { useScreens } from 'react-native-screens'
import { NavigationActions } from 'react-navigation'
useScreens()

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

const darkBackgroundPages: string[] = [
  routeList.Landing,
  routeList.SeedPhrase,
  routeList.Exception,
  routeList.Loading,
  routeList.Entropy,
]

export class NavigatorContainer extends React.Component<Props> {
  private navigator: any

  constructor(props: Props) {
    super(props)
  }

  async componentDidMount() {
    await this.props.initApp()
    await this.props.checkIfAccountExists()
    const url = await Linking.getInitialURL()
    if (url) {
      this.props.handleDeepLink(url)
    }

    Linking.addEventListener('url', this.handleOpenURL)
    BackHandler.addEventListener('hardwareBackPress', this.navigateBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack)
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  private navigateBack = () => {
    // return false if app exit is desired
    if (!this.navigator) return
    const { index, routes } = this.navigator.state.nav
    if (index === 0 && routes.length === 1 && routes[0].index === 0) {
      return false
    }

    this.navigator.dispatch(NavigationActions.back())

    return true
  }

  // When handleOpenURL is called, we pass the event url to the navigate method.
  private handleOpenURL = (event: any) => {
    this.props.handleDeepLink(event.url)
  }

  private setNavigator(nav: any) {
    if (!nav) return
    this.navigator = nav
    navigationActions.setTopLevelNavigator(this.navigator)
  }

  render() {
    let isDarkBackground = false
    if (this.navigator) {
      const { routes, index } = this.navigator.state.nav
      const currentRoute = routes[index].routeName
      isDarkBackground = darkBackgroundPages.includes(currentRoute)
    }

    return (
      <React.Fragment>
        <StatusBar barStyle={isDarkBackground ? 'light-content' : 'default'} />
        <RoutesContainer ref={nav => this.setNavigator(nav)} />
        {this.props.deepLinkLoading && <LoadingSpinner />}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  deepLinkLoading: state.sso.deepLinkLoading,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  handleDeepLink: (url: string) =>
    dispatch(
      withLoading(toggleLoading)(
        withErrorHandling(showErrorScreen)(handleDeepLink(url)),
      ),
    ),
  checkIfAccountExists: () =>
    dispatch(
      withLoading(toggleLoading)(
        withErrorHandling(showErrorScreen)(accountActions.checkIdentityExists),
      ),
    ),
  initApp: () => dispatch(genericActions.initApp),
})
export const Navigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorContainer)
