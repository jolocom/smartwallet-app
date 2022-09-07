import React from 'react'
import { TouchableOpacity, View, Animated, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import ScreenContainer from './ScreenContainer'
import JoloText, { JoloTextKind } from './JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes, Fonts } from '~/utils/fonts'
import { useAdjustResizeInputMode } from '~/hooks/generic'
import Collapsible from './Collapsible'
import useTranslation from '~/hooks/useTranslation'
import { TTitle } from './Collapsible/types'
import { useToasts } from '~/hooks/toasts'

interface Props {
  title: string
  description: string
  onSubmit: (() => Promise<void>) | (() => void)
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
  const { scheduleErrorWarning } = useToasts()

  useAdjustResizeInputMode()

  const dismissScreen = () => {
    navigation.goBack()
  }

  const handleSubmit = () => {
    onSubmit()?.catch(scheduleErrorWarning)
  }

  const getHeaderTitleOpacity = (
    scrollY: Animated.Value,
    currentTitle: TTitle | undefined,
  ) => {
    if (currentTitle === undefined) return 0
    return scrollY.interpolate({
      inputRange: [
        (currentTitle.startY + currentTitle.endY) / 2,
        currentTitle.endY,
      ],
      outputRange: [0, 1],
    })
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.codGrey}
      customStyles={{
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
      <Collapsible
        renderHeader={({ currentTitleText, scrollY, currentTitle }) => (
          <View
            style={{
              flexDirection: 'row',
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
                customStyles={{ fontFamily: Fonts.Medium, textAlign: 'left' }}
              >
                {t('CredentialForm.closeBtn')}
              </JoloText>
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 8, flex: 1 }}>
              <Animated.Text
                style={{
                  opacity: getHeaderTitleOpacity(scrollY, currentTitle),
                  color: Colors.white,
                  marginTop: Platform.OS === 'ios' ? 3 : 0,
                }}
                numberOfLines={1}
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
                  textAlign: 'right',
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
          <Collapsible.KeyboardAwareScroll
            contentContainerStyle={{
              paddingTop: headerHeight,
            }}
          >
            <Collapsible.Title text={title}>
              <JoloText kind={JoloTextKind.title}>{title}</JoloText>
            </Collapsible.Title>
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
            <ScreenContainer.Padding>{children}</ScreenContainer.Padding>
          </Collapsible.KeyboardAwareScroll>
        )}
      ></Collapsible>
    </ScreenContainer>
  )
}

export default FormContainer
