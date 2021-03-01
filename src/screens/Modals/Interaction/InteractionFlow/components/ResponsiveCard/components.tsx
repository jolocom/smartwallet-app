import React, { useRef } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { TextLayoutEvent } from '~/components/Card/Field';
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText';
import BP from '~/utils/breakpoints';
import { Colors } from '~/utils/colors';
import { debugView } from '~/utils/dev';
import { useResponsiveCard } from './context';
import { IResponsiveCardComposition } from './types';

const BASE_CARD_WIDTH = 368;
const BASE_HIGHLIGHT_HEIGHT = 50;

export const Container: IResponsiveCardComposition['Container'] = ({ children }) => {
  const layoutHandled = useRef(0);

  const { setScaleRation } = useResponsiveCard();

  const handleLayout = (e: LayoutChangeEvent) => {
    if (!layoutHandled.current) {
      const { width } = e.nativeEvent.layout;
      setScaleRation(width/BASE_CARD_WIDTH);
      layoutHandled.current += 1;
    }
  }
  return (
    <View style={styles.container} children={children} onLayout={handleLayout} />
  )
}


export const CredentialImage: IResponsiveCardComposition['Image'] = ({ imageUrl }) => {
  const { scaleRatio } = useResponsiveCard();

  const calculatedStyles = {
    width: scaleRatio * 105,
    height: scaleRatio * 105,
    borderRadius: scaleRatio * 105 / 2,
  }
  return (
    <Image style={[styles.image, calculatedStyles]} source={{uri: imageUrl}} />
  )
}

export const CredentialHighlight: IResponsiveCardComposition['Highlight'] = ({ children }) => {
  const { scaleRatio } = useResponsiveCard();
  const calculatedStyles = {
    height: BASE_HIGHLIGHT_HEIGHT * scaleRatio
  }
  return (
    <View style={[styles.highlight, calculatedStyles]}>
      <JoloText
        weight={JoloTextWeight.regular}
        customStyles={{
          fontSize: BP({ default: 24, xsmall: 20 }),
        }}
        color={Colors.white}
        >
        {children}
      </JoloText>
    </View>
  )
}

export const CredentialHolderName: IResponsiveCardComposition['HolderName'] = ({ children, isTruncated }) => {
  const { setHolderNameLines } = useResponsiveCard();

  const handleTextLayout = (e: TextLayoutEvent) => {
    const lines = e.nativeEvent.lines.length;
    setHolderNameLines(lines);
  }
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.black90}
      customStyles={styles.holderName}
      numberOfLines={isTruncated ? 1 : 2}
      // @ts-ignore
      onTextLayout={(e: TextLayoutEvent) => handleTextLayout(e)}
    >
      {children}
    </JoloText>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    zIndex: 100
  },
  highlight: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.black,
    height: 50,
    width: '100%',
    paddingHorizontal: 20,
    borderBottomLeftRadius: BP({default: 13, xsmall: 11}),
    borderBottomRightRadius: BP({default: 13, xsmall: 11}),
    zIndex: 0,
    marginBottom: BP({default: 0, xsmall: -1})
  },
  holderName: {
    textAlign: 'left',
    lineHeight: BP({ xsmall: 20, default: 24 }),
  }
})