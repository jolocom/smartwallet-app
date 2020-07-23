import React from 'react'
import { Linking } from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'

interface LinkPropsI {
  text: string
}

const Link: React.FC<LinkPropsI> = ({ text }) => {
  const handleLinkClick = async (url) => {
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
      <Paragraph color={Colors.white70}>{text}</Paragraph>
    </Hyperlink>
  )
}

export default Link
