import * as React from 'react'
import { addNavigationHelpers } from 'react-navigation'
import { connect } from 'react-redux'
import { BackHandler } from 'react-native'
import { AnyAction } from 'redux'
import { Routes } from 'src/routes'
import { RootState } from 'src/reducers/'
import { navigationActions } from 'src/actions/'

const { createReduxBoundAddListener } = require('react-navigation-redux-helpers')

interface ConnectProps {
  navigation: any;
  goBack: () => void;
}

interface OwnProps {
  dispatch: (action: AnyAction) => void;
}

interface Props extends ConnectProps, OwnProps {}

class Navigator extends React.Component<Props> {
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
    console.log(this.props)
    return (
      <Routes navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.navigation,
        addListener: createReduxBoundAddListener('root')
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
    goBack: () => dispatch(navigationActions.goBack())
  }
}

export const NavigatorContainer = connect(mapStateToProps, mapDispatchToProps)(Navigator)
