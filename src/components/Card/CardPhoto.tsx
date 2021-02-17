import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import BP from '~/utils/breakpoints'
import { useCard } from './context'

const PHOTO_SIZE = BP({ default: 82, xsmall: 60 })

const CardPhoto: React.FC = () => {
  const { image: photo } = useCard()
  if (!photo) return null
  return (
    <View style={styles.container} testID="card-photo">
      <Image style={styles.photo} source={{ uri: photo }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 14,
    bottom: 27,
    zIndex: 10,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
    zIndex: 10,
  },
})

export default CardPhoto
