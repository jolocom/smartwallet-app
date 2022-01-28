import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { SCREEN_WIDTH } from '~/utils/dimensions'
import { Space } from './styled'

interface IInteractionImageProps {
  source?: string
}

const InteractionImage: React.FC<IInteractionImageProps> = ({ source }) => {
  const [shouldRender, setShouldRender] = useState(true)

  const handleImageError = () => {
    setShouldRender(false)
  }

  if (!source || !shouldRender) return null
  return (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: source }}
          style={styles.image}
          onError={handleImageError}
          // NOTE: it will take max Dimension size (260 - width) and make height
          // based on the aspect ration of actual image size
          resizeMode="cover"
        />
      </View>
      <Space />
    </>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6 * 0.88,
  },
})

export default InteractionImage
