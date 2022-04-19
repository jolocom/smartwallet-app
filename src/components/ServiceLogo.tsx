import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import { Colors } from '~/utils/colors'

interface Props {
  source?: string
  renderPlaceholder?: () => JSX.Element
}

export const ServiceLogo: React.FC<Props> = ({ source, renderPlaceholder }) => {
  if (source) {
    return <Image style={styles.image} source={{ uri: source }} />
  }
  return (
    <View style={[styles.image, { backgroundColor: Colors.white }]}>
      {renderPlaceholder ? renderPlaceholder() : <InitiatorPlaceholderIcon />}
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
})
