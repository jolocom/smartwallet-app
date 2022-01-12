import React from 'react'
import { View } from 'react-native'

import Btn from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'

import useTranslation from '~/hooks/useTranslation'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { useAusweisInteraction } from '../hooks'

const AusweisTarnsportWarning = () => {
  const { t } = useTranslation()
  const { startChangePin } = useAusweisInteraction()

  const handleContinue = () => {
    startChangePin()
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
            {t('AusweisTransportPin.warning1')}
          </JoloText>
          <JoloText
            kind={JoloTextKind.title}
            customStyles={{ alignSelf: 'center' }}
            color={Colors.white85}
          >
            {t('AusweisTransportPin.warning2')}
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
