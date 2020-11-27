import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useCard } from './Card'

const CardPhoto: React.FC = () => {
  const { image: photo } = useCard()
  if (!photo) return null
  return (
    <View style={styles.container}>
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
    width: 82,
    height: 82,
    borderRadius: 41,
    zIndex: 10,
  },
})

export default CardPhoto
