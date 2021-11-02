import { useIsFocused, useNavigation } from '@react-navigation/core'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { CardInfo } from 'react-native-aa2-sdk/js/types'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { usePrevious } from '~/hooks/generic'

import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { IS_ANDROID } from '~/utils/generic'

import { useAusweisInteraction } from '../hooks'
import { AusweisPasscodeMode, eIDScreens } from '../types'

interface WhateverProps {
  headerText: string
  descriptionText: string
  hasInlineBtn?: boolean
  btnText: string
  onPress: () => void
}

const TitleDescAction: React.FC<WhateverProps> = ({
  headerText,
  descriptionText,
  hasInlineBtn = false,
  btnText,
  onPress,
}) => {
  return (
    <View style={{ marginBottom: BP({ default: 30, xsmall: 20 }) }}>
      <ScreenContainer.Padding distance={BP({ default: 27, xsmall: 20 })}>
        <JoloText
          kind={JoloTextKind.title}
          customStyles={{ marginBottom: BP({ large: 12, default: 8 }) }}
        >
          {headerText}
        </JoloText>
        <JoloText color={Colors.osloGray}>
          {descriptionText}
          {hasInlineBtn && (
            <JoloText onPress={onPress} color={Colors.activity}>
              ...find more
            </JoloText>
          )}
        </JoloText>
        {!hasInlineBtn && (
          <Btn onPress={onPress} type={BtnTypes.quaternary}>
            {btnText}
          </Btn>
        )}
      </ScreenContainer.Padding>
    </View>
  )
}

const AusweisChangePin = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const prevIsFocused = usePrevious(isFocused)
  const { checkCardValidity, cancelFlow } = useAusweisInteraction()

  const pinHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      /**
       * TODO:
       * rename EnterPin to AusweisPasscode
       */
      /**
       * Android
       * because the eid stack is already there
       */
      if (IS_ANDROID) {
        navigation.navigate(eIDScreens.EnterPIN, {
          mode: AusweisPasscodeMode.PIN,
        })
      } else {
        navigation.navigate(ScreenNames.eId, {
          screen: eIDScreens.EnterPIN,
          params: {
            mode: AusweisPasscodeMode.PIN,
          },
        })
      }
    })
  }, [])

  const canHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(eIDScreens.EnterPIN, {
        mode: AusweisPasscodeMode.CAN,
      })
    })
  }, [])

  const pukHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(eIDScreens.EnterPIN, {
        mode: AusweisPasscodeMode.PUK,
      })
    })
  }, [])

  const setupHandlers = () => {
    aa2Module.resetHandlers()

    aa2Module.setHandlers({
      handleCardRequest: () => {
        if (IS_ANDROID) {
          navigation.navigate(ScreenNames.eId, {
            screen: eIDScreens.AusweisScanner,
            params: { onDismiss: cancelFlow },
          })
        }
      },
      handlePinRequest: (card) => {
        // if (IS_ANDROID) {
        //   updateScanner({
        //     state: AusweisScannerState.success,
        //     onDone: () => {
        //       pinHandler(card)
        //     },
        //   })
        // } else {
        pinHandler(card)
        // }
      },
      handlePukRequest: (card) => {
        // if (IS_ANDROID) {
        //   updateScanner({
        //     state: AusweisScannerState.success,
        //     onDone: () => {
        //       pukHandler(card)
        //     },
        //   })
        // } else {
        pukHandler(card)
        // }
      },
      handleCanRequest: (card) => {
        // if (IS_ANDROID) {
        //   updateScanner({
        //     state: AusweisScannerState.success,
        //     onDone: () => {
        //       canHandler(card)
        //     },
        //   })
        // } else {
        canHandler(card)
        // }
      },
      handleChangePinCancel: () => {
        // if (IS_ANDROID) {
        //   updateScanner({
        //     state: AusweisScannerState.success,
        //     onDone: cancelFlow,
        //   })
        // }
        cancelFlow()
      },
    })
  }

  useEffect(() => {
    if (isFocused === true && !Boolean(prevIsFocused)) {
      setupHandlers()
    }
  }, [isFocused])

  const handleChange5DigPin = () => {
    console.warn('not implemented')
  }
  const handleChange6DigPin = () => {
    aa2Module.changePin()
  }
  const handlePreviewAuthorityInfo = () => {
    console.warn('not implemented')
  }

  return (
    <ScreenContainer
      hasHeaderBack
      navigationStyles={{ backgroundColor: Colors.mainBlack }}
      customStyles={{ justifyContent: 'space-around' }}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TitleDescAction
          headerText="Do you have 5-digit PIN?"
          descriptionText="You should have received it with the letter together with your card"
          btnText="Start the process"
          onPress={handleChange5DigPin}
        />
        <TitleDescAction
          headerText="Activate your 6-digit PIN code"
          descriptionText="You can find it in the bottom right corner on the front side of your ID card"
          btnText="Start the process"
          onPress={handleChange6DigPin}
        />
      </View>
      <TitleDescAction
        hasInlineBtn
        headerText="Can’t find any of this?"
        descriptionText="If you completely forgot your PIN and can not find your PIN letter, please turn to the competent authority"
        btnText="find more"
        onPress={handlePreviewAuthorityInfo}
      />
    </ScreenContainer>
  )
}

export default AusweisChangePin
