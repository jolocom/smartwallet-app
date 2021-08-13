import React from 'react'
import { TouchableOpacity, View, Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import ScreenContainer from './ScreenContainer'
import JoloText, { JoloTextKind } from './JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes, Fonts } from '~/utils/fonts'
import { useAdjustResizeInputMode } from '~/hooks/generic'
import CollapsibleClone from './CollapsibleClone'
import useTranslation from '~/hooks/useTranslation'

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
  const { t } = useTranslation()
  const navigation = useNavigation()

  useAdjustResizeInputMode()

  const dismissScreen = () => {
    navigation.goBack()
  }

  const handleSubmit = () => {
    onSubmit()
  }

  const getHeaderTitleOpacity = (
    scrollY: Animated.Value,
    headerHeight: number,
  ) =>
    scrollY.interpolate({
      inputRange: [headerHeight / 2, headerHeight],
      outputRange: [0, 1],
    })

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
      <CollapsibleClone
        renderHeader={(currentTitleText, scrollY, headerHeight) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: Colors.codGrey,
              paddingHorizontal: 24,
              height: 50,
            }}
          >
            <TouchableOpacity onPress={dismissScreen}>
              <JoloText
                kind={JoloTextKind.title}
                size={JoloTextSizes.mini}
                color={Colors.white90}
                customStyles={{ fontFamily: Fonts.Medium }}
              >
                {t('CredentialForm.closeBtn')}
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
                {t('CredentialForm.confirmBtn')}
              </JoloText>
            </TouchableOpacity>
          </View>
        )}
        renderScroll={({ headerHeight }) => (
          <CollapsibleClone.KeyboardAwareScroll
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
          </CollapsibleClone.KeyboardAwareScroll>
        )}
      ></CollapsibleClone>
    </ScreenContainer>
  )
}

export default FormContainer
