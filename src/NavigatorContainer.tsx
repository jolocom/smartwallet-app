import * as React from 'react'
import { NavigationActions, addNavigationHelpers, } from 'react-navigation'
import { connect } from 'react-redux'
import { BackHandler } from 'react-native'
import { Routes } from 'src/routes'

const { createReduxBoundAddListener } = require('react-navigation-redux-helpers')

class Navigator extends React.Component<any> {
  constructor(props: any) {
    super(props)
    BackHandler.addEventListener('hardwareBackPress', this.navigateBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack)
  }

  private navigateBack = () => {
    this.props.dispatch(NavigationActions.back())
    return true
  }

  render() {
    return (
      <Routes navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.navigation,
        addListener: createReduxBoundAddListener('root')
      })}/>
    )
  }
}

const mapStateToProps = (state: any) => ({
  navigation: state.navigation
})

export const NavigatorContainer = connect(mapStateToProps)(Navigator)
