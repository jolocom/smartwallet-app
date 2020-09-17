import React from 'react'
import { Linking } from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from './JoloText'

interface LinkPropsI {
  text: string
}

const Link: React.FC<LinkPropsI> = ({ text }) => {
  const handleLinkClick = async (url: string) => {
    try {
      const isSupported = await Linking.canOpenURL(url)
      if (isSupported) {
        await Linking.openURL(url)
      } else {
        // TODO: show toast here
        console.warn('Unable to open url', url)
      }
    } catch (err) {
      // TODO: show toast here
      console.warn('Unable to open url', url)
    }
  }
  return (
    <Hyperlink
      onPress={handleLinkClick}
      linkStyle={{ textDecorationLine: 'underline' }}
    >
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={Colors.white70}
      >
        {text}
      </JoloText>
    </Hyperlink>
  )
}

export default Link
