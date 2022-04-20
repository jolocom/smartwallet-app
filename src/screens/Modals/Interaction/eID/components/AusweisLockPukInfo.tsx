import React from 'react'
import { useNavigation } from '@react-navigation/core'
import { Image, View } from 'react-native'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import eIDHooks from '../hooks'
import { AusweisFlow, AusweisPasscodeMode, eIDScreens } from '../types'

/**
 * TODO:
 * 1. in cancel workflow PR there is a hook available
 * that adds hoc to handle back btn behavior
 * 2. disable gestures also done in the above PR
 */
const AusweisLockPukInfo: React.FC = () => {
  const { t } = useTranslation()
  /**
   * TODO: this has changed in cancelling workflow PR,
   * this should be updated to 'cancelInteraction'
   */
  const { cancelInteraction } = eIDHooks.useAusweisInteraction()
  const navigation = useNavigation()

  eIDHooks.useAusweisCancelBackHandler()

  const handleContinueWithPuk = () => {
    navigation.navigate(eIDScreens.EnterPIN, {
      mode: AusweisPasscodeMode.PUK,
      flow: AusweisFlow.auth,
    })
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      customStyles={{
        justifyContent: 'space-between',
        paddingVertical: 20,
      }}
    >
      <JoloText
        size={JoloTextSizes.middle}
        kind={JoloTextKind.title}
        color={Colors.white}
      >
        {t('AusweisPukLock.header')}
      </JoloText>
      <Image source={require('~/assets/images/lockedCard.png')} />
      <JoloText
        size={JoloTextSizes.middle}
        kind={JoloTextKind.subtitle}
        color={Colors.white40}
      >
        {t('AusweisPukLock.subtitle')}
      </JoloText>
      <View style={{ width: '100%', paddingBottom: 8 }}>
        <Btn onPress={handleContinueWithPuk} type={BtnTypes.quaternary}>
          {t('AusweisPukLock.proceedBtn')}
        </Btn>
        <Btn onPress={cancelInteraction} type={BtnTypes.secondary}>
          {t('AusweisPukLock.closeBtn')}
        </Btn>
      </View>
    </ScreenContainer>
  )
}

export default AusweisLockPukInfo
