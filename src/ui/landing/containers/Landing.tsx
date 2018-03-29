import * as React from 'react'
import { View, Text, Animated, StyleSheet, Image, Dimensions, ScrollView  } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { LandingComponent } from '../components/Landing'
import { registrationActions } from '../../../actions'
import { StackNavigator } from 'react-navigation'

export interface ReduxProps {
  navigation : any
}
export interface ComponentState {
  activeSlide: number
}

class LandingContainer extends React.Component<ReduxProps, ComponentState> {
  constructor(props: ReduxProps) {
    super(props)
    this.state = {activeSlide: 0};
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <LandingComponent
        updateActiveSlide={(index : number) => this.setState({activeSlide: index})}
        activeSlide={this.state.activeSlide}
        clickNext={() => navigate('PasswordEntry')}/>
    )
  }
}

export const Landing = LandingContainer
