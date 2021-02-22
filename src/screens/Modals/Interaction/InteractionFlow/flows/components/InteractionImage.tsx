import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getInteractionImage } from '~/modules/interaction/selectors';
import { SCREEN_WIDTH } from '~/utils/dimenstions';
import { Space } from './styled';

const InteractionImage: React.FC = () => {
  const source = useSelector(getInteractionImage);
  if (!source) return null
  return (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: source }}
          style={styles.image}
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
  }
})

export default InteractionImage;