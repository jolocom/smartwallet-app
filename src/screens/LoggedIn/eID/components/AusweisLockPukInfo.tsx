import { useBackHandler } from '@react-native-community/hooks'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Image, View } from 'react-native'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { WithNavigation } from '~/types/props'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useAusweisInteraction } from '../hooks'
import { AusweisPasscodeMode, eIDScreens } from '../types'

/**
 * TODO:
 * 1. in cancel workflow PR there is a hook available
 * that adds hoc to handle back btn behavior
 * 2. disable gestures also done in the above PR
 */
const AusweisLockPukInfo: React.FC = () => {
  /**
   * TODO: this has changed in cancelling workflow PR,
   * this should be updated to 'cancelInteraction'
   */
  const { cancelInteraction } = useAusweisInteraction()
  const navigation = useNavigation()

  useBackHandler(() => {
    cancelInteraction()
    return true
  })

  const handleContinueWithPuk = () => {
    navigation.navigate(eIDScreens.EnterPIN, { mode: AusweisPasscodeMode.PUK })
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      customStyles={{
        justifyContent: 'space-between',
        marginVertical: 20,
      }}
    >
      <JoloText
        size={JoloTextSizes.middle}
        kind={JoloTextKind.title}
        color={Colors.white}
      >
        Your card is locked now and you have to introduce PUK code to unlock it
      </JoloText>
      <Image source={require('~/assets/images/lockedCard.png')} />
      <JoloText
        size={JoloTextSizes.middle}
        kind={JoloTextKind.subtitle}
        color={Colors.white40}
      >
        You can always unlock your card by using “Unlock my card” button in the
        Identity tab
      </JoloText>
      <View style={{ width: '100%' }}>
        <Btn onPress={handleContinueWithPuk} type={BtnTypes.quaternary}>
          Continue with the PUK code
        </Btn>
        <Btn onPress={cancelInteraction} type={BtnTypes.secondary}>
          Close interaction
        </Btn>
      </View>
    </ScreenContainer>
  )
}

export default AusweisLockPukInfo
