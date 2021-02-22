import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { InitiatorPlaceholderIcon } from '~/assets/svg';

interface ILogoProps {
  initiatorIcon: string;
}
const InteractionLogo: React.FC<ILogoProps> = ({ initiatorIcon }) => {
  if (initiatorIcon) {
    return (
      <Image style={styles.image} source={{ uri: initiatorIcon }} />
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