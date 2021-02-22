import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { InitiatorPlaceholderIcon } from '~/assets/svg';

interface ILogoProps {
  source: string;
}
const InteractionLogo: React.FC<ILogoProps> = ({ source }) => {
  if (source) {
    return (
      <Image style={styles.image} source={{ uri: source }} />
    )    
  }
  return (
    <View>
      <InitiatorPlaceholderIcon />
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

export default InteractionLogo;