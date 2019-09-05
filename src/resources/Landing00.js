import React from 'react'
import { ImageBackground } from 'react-native'
import { Presets } from 'src/styles'
const image = require('src/resources/img/00.png')

export default class Landing00 extends React.PureComponent {
  render() {
    return (
      <ImageBackground
        source={image}
        style={Presets.landingBackground}
        imageStyle={Presets.landingBackgroundImage}
      />
    )
  }
}
