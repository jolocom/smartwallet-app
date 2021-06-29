import React, { SetStateAction } from 'react'
import {
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  Animated,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import ScreenContainer from './ScreenContainer'
import JoloText, { JoloTextKind } from './JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes, Fonts } from '~/utils/fonts'
import { useAdjustResizeInputMode } from '~/hooks/generic'
import CollapsibleClone from './CollapsibleClone'
import { AnimatedKeyboardAwareScrollView } from './JoloKeyboardAwareScroll/animated'
import { useRef } from 'react'

interface Props {
  title: string
  description: string
  onSubmit: () => Promise<void>
  isSubmitDisabled?: boolean
}

const FormContainer: React.FC<Props> = ({
  title,
  description,
  onSubmit,
  children,
  isSubmitDisabled = false,
}) => {
  const navigation = useNavigation()

  useAdjustResizeInputMode()

  const dismissScreen = () => {
    navigation.goBack()
  }

  const handleSubmit = () => {
    onSubmit()
  }

  const handleLayout = (
    e: LayoutChangeEvent,
    setHeaderHeight: React.Dispatch<SetStateAction<number>>,
  ) => {
    const { height } = e.nativeEvent.layout
    setHeaderHeight(height)
  }

  const getHeaderTitleOpacity = (
    scrollY: Animated.Value,
    headerHeight: number,
  ) =>
    scrollY.interpolate({
      inputRange: [headerHeight / 2, headerHeight],
      outputRange: [0, 1],
    })

  const ref = useRef(null)

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
      <CollapsibleClone
        renderHeader={(
          currentTitleText,
          scrollY,
          setHeaderHeight,
          headerHeight,
        ) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: Colors.codGrey,
              paddingHorizontal: 24,
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 1,
              width: '100%',
            }}
            onLayout={(e) => handleLayout(e, setHeaderHeight)}
          >
            <TouchableOpacity onPress={dismissScreen}>
              <JoloText
                kind={JoloTextKind.title}
                size={JoloTextSizes.mini}
                color={Colors.white90}
                customStyles={{ fontFamily: Fonts.Medium }}
              >
                Cancel
              </JoloText>
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 8 }}>
              <Animated.Text
                style={{
                  opacity: getHeaderTitleOpacity(scrollY, headerHeight),
                  color: 'white',
                }}
              >
                {currentTitleText}
              </Animated.Text>
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              testID="form-container-submit"
            >
              <JoloText
                kind={JoloTextKind.title}
                size={JoloTextSizes.mini}
                color={Colors.activity}
                customStyles={{
                  fontFamily: Fonts.Medium,
                  ...(isSubmitDisabled && { opacity: 0.5 }),
                }}
              >
                Done
              </JoloText>
            </TouchableOpacity>
          </View>
        )}
        renderScroll={({ onScroll, onSnap, headerHeight }) => (
          <AnimatedKeyboardAwareScrollView
            // TODO: set ref correctly
            ref={ref}
            onScroll={onScroll}
            onScrollEndDrag={(e) => onSnap(e, ref)}
            contentContainerStyle={{
              paddingTop: headerHeight,
            }}
          >
            <CollapsibleClone.Title text={title} />
            <JoloText
              size={JoloTextSizes.mini}
              customStyles={{
                marginTop: 8,
                marginBottom: 36,
                paddingHorizontal: 32,
              }}
            >
              {description}
            </JoloText>
            {children}
          </AnimatedKeyboardAwareScrollView>
        )}
      ></CollapsibleClone>
    </ScreenContainer>
  )
}

export default FormContainer
