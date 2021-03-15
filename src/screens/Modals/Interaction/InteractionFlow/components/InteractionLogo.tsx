import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { InitiatorPlaceholderIcon } from '~/assets/svg';
import { getServiceImage } from '~/modules/interaction/selectors';

const InteractionLogo: React.FC = () => {
  const source = useSelector(getServiceImage);
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