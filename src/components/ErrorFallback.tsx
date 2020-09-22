import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind, JoloTextWeight } from './JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface Props {
  title: string
  description: string
}

export const ErrorFallback: React.FC<Props> = ({
  title,
  description,
  children,
}) => (
  <ScreenContainer>
    <View style={styles.imageContainer}>
      <View style={styles.imagePadding} />
      <Image
        resizeMode={'contain'}
        style={styles.image}
        source={require('~/assets/images/error-planets.png')}
      />
    </View>
    <View style={styles.textContainer}>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
      >
        {title}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white70}
      >
        {description}
      </JoloText>
    </View>
    <View style={styles.buttonContainer}>{children}</View>
  </ScreenContainer>
)

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    width: '100%',
  },
  image: {
    flex: 2,
    // NOTE hack to fit the image into the parent View {@link https://stackoverflow.com/a/48650028}
    width: undefined,
  },
  imagePadding: {
    flex: 0.6,
  },
  textContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 0.5,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: '5%',
  },
})
