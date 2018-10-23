import React from 'react'
import { addNavigationHelpers, NavigationEventSubscription, NavigationEventCallback } from 'react-navigation'
import { connect } from 'react-redux'
import { BackHandler, Linking, Platform } from 'react-native'
import { AnyAction } from 'redux'
import { Routes } from 'src/routes'
import { RootState } from 'src/reducers/'
import { navigationActions, ssoActions } from 'src/actions/'

const { createReduxBoundAddListener } = require('react-navigation-redux-helpers')

interface ConnectProps {
  navigation: RootState["navigation"];
  goBack: () => void;
  parseJWT: (jwt: string) => void;
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
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url: string) => {
        this.handleNavigation(url)
      })
    } else {
      Linking.addEventListener('url', this.handleOpenURL)
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack)
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  private navigateBack = () => {
    this.props.goBack()
    return true
  }

    
  private handleOpenURL = (event: any) => {
    this.handleNavigation(event.url)
  }

  private handleNavigation = (url: string) => {
    // TODO: Fix TS null check errors after enabling 'stri'ctNullC'hecks' in tsconfig
    const route = url.replace(/.*?:\/\//g, '')
    const params = (route.match(/\/([^\/]+)\/?$/) as string[])[1]
    const routeName = route.split('/')[0]
  
    if (routeName === 'consent') {
      this.props.parseJWT(params)
    }
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
    parseJWT: (jwt: string) => dispatch(ssoActions.parseJWT(jwt))
  }
}

export const Navigator = connect(mapStateToProps, mapDispatchToProps)(NavigatorContainer  )
