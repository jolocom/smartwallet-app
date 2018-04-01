import * as React from 'react'
import { StackNavigator, addNavigationHelpers, NavigationStackAction } from 'react-navigation'
import { connect } from 'react-redux'
import { Home } from 'src/ui/home/'
import { Landing } from 'src/ui/landing/'
import { PasswordEntry, SeedPhrase } from 'src/ui/registration'

const { createReduxBoundAddListener } = require('react-navigation-redux-helpers')

export const AppNavigator = StackNavigator({
    Landing: { screen: Landing },
    PasswordEntry: { screen: PasswordEntry },
    SeedPhrase: { screen: SeedPhrase },
    Home: { screen: Home }
  }, {
    headerMode: 'none'
  }
)

class Navigator extends React.Component<any> {
  render() {
    return (
      <AppNavigator navigation={ addNavigationHelpers({
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

// tslint:disable-next-line
export const NavigatorComponent = connect(mapStateToProps, null)(Navigator)
