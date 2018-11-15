import React from 'react'
import { addNavigationHelpers, NavigationEventSubscription, NavigationEventCallback } from 'react-navigation'
import { connect } from 'react-redux'
import { BackHandler, Linking, Platform } from 'react-native'
import { AnyAction } from 'redux'
import { Routes } from 'src/routes'
import { RootState } from 'src/reducers/'
import { navigationActions } from 'src/actions/'

const { createReduxBoundAddListener } = require('react-navigation-redux-helpers')

interface ConnectProps {
  navigation: RootState["navigation"];
  goBack: () => void;
  handleDeepLink: (url: string) => void
}

interface OwnProps {
  dispatch: (action: AnyAction) => void;
}

interface Props extends ConnectProps, OwnProps {}

export class NavigatorContainer extends React.Component<Props> {
  private addListener: (name: string, cb: NavigationEventCallback) =>
    NavigationEventSubscription

  constructor(props: Props) {
    super(props)
    this.addListener = createReduxBoundAddListener('root')
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.navigateBack)
    // If we are on Android, we immediately call the navigate method passing in the url
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url: string) => {
        // tslint:disable-next-line: no-unused-expression
        url && this.props.handleDeepLink(url)
      })
    } else {
      // If we are on iOS, We add an event listener to call handleOpenUrl when an incoming link is detected.
      Linking.addEventListener('url', this.handleOpenURL)
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack)
    // We delete the Linking listener on componentWillUnmount
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  private navigateBack = () => {
    this.props.goBack()
    return true
  }

  //When handleOpenURL is called, we pass the event url to the navigate method.
  private handleOpenURL = (event: any) => {
    this.props.handleDeepLink(event.url)
  }

  render() {
    return (
      <Routes navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.navigation,
        addListener: this.addListener
      })}/>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    navigation: state.navigation
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    goBack: () => dispatch(navigationActions.goBack()),
    handleDeepLink: (url: string) => dispatch(navigationActions.handleDeepLink(url))
  }
}

export const Navigator = connect(mapStateToProps, mapDispatchToProps)(NavigatorContainer  )
