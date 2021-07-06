import React from 'react'

import Collapsible from './Collapsible'
import ScreenContainer from './ScreenContainer'
import JoloText, { JoloTextKind } from './JoloText'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { JoloTextSizes, Fonts } from '~/utils/fonts'
import { useAdjustResizeInputMode } from '~/hooks/generic'
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

  return (
    <Collapsible>
      <Collapsible.Header
        customStyles={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: Colors.codGrey,
          paddingHorizontal: 24,
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
          <Collapsible.HeaderText>{title}</Collapsible.HeaderText>
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
      </Collapsible.Header>
      <ScreenContainer backgroundColor={Colors.codGrey}>
        <Collapsible.KeyboardAwareScrollView
          disableInsets
          customStyles={{ paddingBottom: 100 }}
          enableOnAndroid={false}
        >
          <Collapsible.HidingTextContainer>
            <JoloText kind={JoloTextKind.title}>{title}</JoloText>
          </Collapsible.HidingTextContainer>
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
        </Collapsible.KeyboardAwareScrollView>
      </ScreenContainer>
    </Collapsible>
  )
}

export default FormContainer
