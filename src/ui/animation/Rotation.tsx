import React from 'react'
import { Animated, Easing } from 'react-native'

interface Props {
  style?: object
}
interface State {
  animValue: Animated.Value
}
export default class Rotation extends React.Component<Props, State> {
  public state = {
    animValue: new Animated.Value(0),
  }

  public componentDidMount() {
    Animated.timing(this.state.animValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
    }).start() // Starts the animation
  }

  public render() {
    const { animValue } = this.state
    const rotation = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'], // degree of rotation
    })
    return (
      <Animated.View
        style={{
          ...this.props.style,
          transform: [{ rotate: rotation }],
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
