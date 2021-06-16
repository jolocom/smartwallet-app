import React, { Children, useRef } from 'react'
import {
  Image,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { TextLayoutEvent } from '~/components/Card/Field'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useResponsiveCard } from './context'
import { IResponsiveCardComposition } from './types'

const BASE_CARD_WIDTH = 368
const BASE_HIGHLIGHT_HEIGHT = 50

export const Container: IResponsiveCardComposition['Container'] = ({
  children,
}) => {
  const layoutHandled = useRef(0)

  const { setScaleRation } = useResponsiveCard()

  const handleLayout = (e: LayoutChangeEvent) => {
    if (!layoutHandled.current) {
      const { width } = e.nativeEvent.layout
      setScaleRation(width / BASE_CARD_WIDTH)
      layoutHandled.current += 1
    }
  }
  return (
    <View
      style={styles.container}
      children={children}
      onLayout={handleLayout}
    />
  )
}

export const CredentialImage: IResponsiveCardComposition['Image'] = ({
  imageUrl,
}) => {
  const { scaleRatio } = useResponsiveCard()

  const calculatedStyles = {
    width: scaleRatio * 105,
    height: scaleRatio * 105,
    borderRadius: (scaleRatio * 105) / 2,
  }
  return (
    <Image
      style={[styles.image, calculatedStyles]}
      source={{ uri: imageUrl }}
    />
  )
}

export const CredentialHighlight: IResponsiveCardComposition['Highlight'] = ({
  children,
}) => {
  const { scaleRatio } = useResponsiveCard()
  const calculatedStyles = {
    height: BASE_HIGHLIGHT_HEIGHT * scaleRatio,
    borderBottomLeftRadius: scaleRatio * 9.5,
    borderBottomRightRadius: scaleRatio * 9.5,
  }
  return (
    <View style={[styles.highlight, calculatedStyles]}>
      <JoloText weight={JoloTextWeight.regular} color={Colors.white}>
        {children}
      </JoloText>
    </View>
  )
}

export const CredentialHolderName: IResponsiveCardComposition['HolderName'] = ({
  children,
}) => {
  const { setHolderNameLines } = useResponsiveCard()

  const handleTextLayout = (e: TextLayoutEvent) => {
    const lines = e.nativeEvent.lines.length
    setHolderNameLines(lines)
  }
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.black90}
      customStyles={styles.holderName}
      ignoreScaling
      numberOfLines={2}
      // @ts-ignore
      onTextLayout={(e: TextLayoutEvent) => handleTextLayout(e)}
    >
      {children}
    </JoloText>
  )
}

export const FieldsCalculator: IResponsiveCardComposition['FieldsCalculator'] =
  ({ children, cbFieldsVisibility }) => {
    const { fieldLines, holderNameLines } = useResponsiveCard()

    /* We can't display all the fields that a service provides,
     therefore running a callback which decides what child to
     display and which one to cut off
  */
    const childrenToDisplay = Children.map(children, (child, idx) => {
      return cbFieldsVisibility(child, idx, fieldLines, holderNameLines)
    })

    return childrenToDisplay
  }

export const FieldValue: IResponsiveCardComposition['FieldValue'] = ({
  children,
  customStyles,
  idx,
  onNumberOfFieldLinesToDisplay,
}) => {
  const { fieldLines, onFieldValueLayout } = useResponsiveCard()
  return (
    <JoloText
      weight={JoloTextWeight.regular}
      size={JoloTextSizes.mini}
      kind={JoloTextKind.title}
      customStyles={[styles.value, customStyles]}
      // @ts-ignore: TextProps does not seem to have onTextLayout in type def.
      onTextLayout={(e: TextLayoutEvent) => onFieldValueLayout(e, idx)}
      numberOfLines={onNumberOfFieldLinesToDisplay(idx, fieldLines)}
    >
      {children}
    </JoloText>
  )
}

export const FieldPlaceholder: IResponsiveCardComposition['FieldPlaceholder'] =
  ({ width }) => {
    const { scaleRatio } = useResponsiveCard()
    const calculatedStyles = {
      width: scaleRatio * width,
      height: scaleRatio * 20,
      borderRadius: scaleRatio * 5,
    }
    return <View style={[styles.fieldPlaceholder, calculatedStyles]} />
  }

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    zIndex: 100,
  },
  highlight: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.black,
    height: 50,
    width: Platform.OS === 'ios' ? '101%' : '100%',
    paddingHorizontal: 20,
    zIndex: 0,
    marginBottom: -1,
  },
  holderName: {
    textAlign: 'left',
    lineHeight:
      Platform.OS === 'ios'
        ? BP({ xsmall: 20, default: 24 })
        : BP({ xsmall: 24, default: 28 }),
  },
  value: {
    color: Colors.black,
    textAlign: 'left',
    lineHeight:
      Platform.OS === 'ios'
        ? BP({ xsmall: 12, default: 16 })
        : BP({ xsmall: 14, default: 18 }),
    marginTop: Platform.OS === 'ios' ? 0 : 4,
  },
  fieldPlaceholder: {
    backgroundColor: Colors.alto,
    opacity: 0.58,
  },
})