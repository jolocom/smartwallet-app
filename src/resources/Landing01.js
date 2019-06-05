import React from 'react'
import { ImageBackground } from 'react-native'
import I18n, { getI18nImage } from 'src/locales/i18n';
const image = getI18nImage('01.jpg')


export default class Landing00 extends React.PureComponent {
  render() {
    return (
      <ImageBackground
        source={ image }
        style={{width: '100%', height: '100%', position: 'absolute'}}
      />
    )
  }
}
