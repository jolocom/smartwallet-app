import React from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import { IWithCustomStyle } from '~/types/props'

import { Colors } from '~/utils/colors'
import JoloText from './JoloText'

interface LinkPropsI extends IWithCustomStyle {
  url: string
}

const Link: React.FC<LinkPropsI> = ({ url, children, customStyles }) => {
  const handleLinkClick = async () => {
    try {
      const isSupported = await Linking.canOpenURL(url)
      if (isSupported) {
        await Linking.openURL(url)
      } else {
        // TODO: show toast here?
        console.warn('Unable to open url', url)
      }
    } catch (err) {
      // TODO: show toast here?
      console.warn('Unable to open url', url)
    }
  }
  return (
    <TouchableOpacity onPress={handleLinkClick} style={customStyles}>
      <JoloText color={Colors.success}>{children}</JoloText>
    </TouchableOpacity>
  )
}

export default Link
