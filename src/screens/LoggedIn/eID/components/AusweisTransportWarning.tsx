import React from 'react'
import { Platform, View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { useDispatch } from 'react-redux'

import Btn from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'

import useTranslation from '~/hooks/useTranslation'
import { setPopup } from '~/modules/appState/actions'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

const AusweisTarnsportWarning = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  /**
   * TODO: @translation
   */
  const text1 =
    'Please note that If you already set a six-digit PIN previously, the five-digit Transport PIN is no longer valid.'
  const text2 =
    'You may use the five-digit Transport PIN only once to change PIN.'

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      dispatch(setPopup(true))
    }
    aa2Module.changePin()
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.black95}
      customStyles={{ justifyContent: 'flex-end' }}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ScreenContainer.Padding>
          <JoloText
            kind={JoloTextKind.title}
            customStyles={{ alignSelf: 'center', marginBottom: 25 }}
            color={Colors.white85}
          >
            {text1}
          </JoloText>
          <JoloText
            kind={JoloTextKind.title}
            customStyles={{ alignSelf: 'center' }}
            color={Colors.white85}
          >
            {text2}
          </JoloText>
        </ScreenContainer.Padding>
      </View>
      <BtnGroup>
        <Btn
          onPress={handleContinue}
          customContainerStyles={{
            marginBottom: BP({ default: 40, xsmall: 20 }),
          }}
        >
          {t('RecoveryInfo.closeBtn')}
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

export default AusweisTarnsportWarning
