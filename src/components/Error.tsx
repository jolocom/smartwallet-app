import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import ScreenContainer from '~/components/ScreenContainer';
import {TextStyle} from '~/utils/fonts';

interface Props {
  title: string;
  description: string;
}

export const ErrorComponent: React.FC<Props> = ({
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
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <View style={styles.buttonContainer}>{children}</View>
  </ScreenContainer>
);

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
  },
  buttonContainer: {
    flex: 0.5,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: '5%',
  },
  title: {
    marginTop: 36,
    textAlign: 'center',
    ...TextStyle.middleTitleRegular,
  },
  description: {
    marginTop: 12,
    marginHorizontal: '5%',
    textAlign: 'center',
    ...TextStyle.middleSubtitle,
  },
});
