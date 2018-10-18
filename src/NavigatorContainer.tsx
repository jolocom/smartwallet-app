import React from 'react'
import { addNavigationHelpers, NavigationEventSubscription, NavigationEventCallback } from 'react-navigation'
import { connect, Dispatch } from 'react-redux'
import { BackHandler } from 'react-native'
import { AnyAction } from 'redux'
import { Routes } from 'src/routes'
import { RootState } from 'src/reducers/'
import { navigationActions } from 'src/actions/'
import { withDeepLinking } from 'src/lib/withDeepLinking'

const { createReduxBoundAddListener } = require('react-navigation-redux-helpers')

interface ConnectProps {
  navigation: RootState["navigation"];
  goBack: () => void;
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
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack)
  }

  private navigateBack = () => {
    this.props.goBack()
    return true
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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    goBack: () => dispatch(navigationActions.goBack())
  }
}
const navigationWithDeepLinking = withDeepLinking(
  class extends React.Component<Props> {
    render() {
      return (
        <NavigatorContainer
          dispatch={this.props.dispatch}
          navigation={this.props.navigation}
          goBack={this.props.goBack}
         />
      )
    }
  }
)

export const Navigator = connect(mapStateToProps, mapDispatchToProps)(navigationWithDeepLinking)
