import { useNavigation } from '@react-navigation/core'
import { StackActions } from '@react-navigation/routers'
import React, { useCallback, useRef } from 'react'
import { View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { EventHandlers } from 'react-native-aa2-sdk/js/commandTypes'
import { CardInfo } from 'react-native-aa2-sdk/js/types'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'

import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { IS_ANDROID } from '~/utils/generic'

import {
  useAusweisInteraction,
  useAusweisScanner,
  useCheckNFC,
  useDeactivatedCard,
} from '../hooks'
import {
  AusweisFlow,
  AusweisPasscodeMode,
  AusweisScannerState,
  CardInfoMode,
  eIDScreens,
} from '../types'

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
}) => (
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
            ...{btnText}
          </JoloText>
        )}
      </JoloText>
      {!hasInlineBtn && (
        <Btn
          onPress={onPress}
          type={BtnTypes.quaternary}
          customTextStyles={{ opacity: 1 }}
        >
          {btnText}
        </Btn>
      )}
    </ScreenContainer.Padding>
  </View>
)

const AusweisChangePin = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { checkCardValidity, cancelFlow } = useAusweisInteraction()
  const { showScanner, updateScanner } = useAusweisScanner()
  const { handleDeactivatedCard } = useDeactivatedCard()
  const isTransportPin = useRef(false)
  const { checkNfcSupport } = useCheckNFC()

  const changePinFlow =
    isTransportPin.current === true
      ? AusweisFlow.changeTransportPin
      : AusweisFlow.changePin

  const pinHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.EnterPIN,
        params: {
          flow: changePinFlow,
          mode:
            isTransportPin.current === true
              ? AusweisPasscodeMode.TRANSPORT_PIN
              : AusweisPasscodeMode.PIN,
          pinContext: isTransportPin.current
            ? AusweisPasscodeMode.TRANSPORT_PIN
            : undefined,
        },
      })
    })
  }, [])

  const canHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.EnterPIN,
        params: {
          flow: changePinFlow,
          mode: AusweisPasscodeMode.CAN,
          pinContext: isTransportPin.current
            ? AusweisPasscodeMode.TRANSPORT_PIN
            : undefined,
        },
      })
    })
  }, [])

  const pukHandler = useCallback((card: CardInfo) => {
    /**
     * User should be able to set PUK only with 'Unlock
     * blocked card' within ChangePin flow, all other use cases
     * of ChangePin flow should redirect to AusweisIdentity to
     * "Unlock blocked card"
     */
    navigation.navigate(ScreenNames.TransparentModals, {
      screen: ScreenNames.AusweisCardInfo,
      params: {
        mode: CardInfoMode.standaloneUnblock,
        onDismiss: cancelFlow,
      },
    })
  }, [])

  const setupHandlers = (handlers: Partial<EventHandlers> = {}) => {
    aa2Module.resetHandlers()

    aa2Module.setHandlers({
      handleCardInfo: (card) => {
        if (card?.deactivated) {
          handleDeactivatedCard(navigation.goBack)
        }
      },
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner(cancelFlow)
        }
      },
      handlePinRequest: (card) => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              pinHandler(card)
            },
          })
        } else {
          pinHandler(card)
        }
      },
      handlePukRequest: (card) => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              pukHandler(card)
            },
          })
        } else {
          pukHandler(card)
        }
      },
      handleCanRequest: (card) => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              canHandler(card)
            },
          })
        } else {
          canHandler(card)
        }
      },
      ...handlers,
    })
  }

  const handleChange5DigPin = () => {
    checkNfcSupport(() => {
      isTransportPin.current = true
      setupHandlers({
        handleCardInfo: (card) => {
          if (card?.deactivated) {
            handleDeactivatedCard(() => {
              navigation.dispatch(StackActions.pop())
            })
          }
        },
        handleChangePinCancel: () => {
          if (IS_ANDROID) {
            navigation.goBack()
          }
        },
      })
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.AusweisTransportWarning,
      })
    })
  }
  const handleChange6DigPin = () => {
    checkNfcSupport(() => {
      isTransportPin.current = false
      setupHandlers()
      aa2Module.changePin()
    })
  }

  const handlePreviewAuthorityInfo = () => {
    navigation.navigate(ScreenNames.eId, { screen: eIDScreens.ForgotPin })
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'space-around' }}
      backgroundColor={Colors.mainDark}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TitleDescAction
          headerText={t('AusweisChangePin.transportPinHeader')}
          descriptionText={t('AusweisChangePin.transportPinSubheader')}
          btnText={t('AusweisChangePin.transportPinBtn')}
          onPress={handleChange5DigPin}
        />
        <TitleDescAction
          headerText={t('AusweisChangePin.pinHeader')}
          descriptionText={t('AusweisChangePin.pinSubheader')}
          btnText={t('AusweisChangePin.pinBtn')}
          onPress={handleChange6DigPin}
        />
      </View>
      <TitleDescAction
        hasInlineBtn
        headerText={t('AusweisChangePin.forgotHeader')}
        descriptionText={t('AusweisChangePin.forgotSubheader')}
        btnText={t('AusweisChangePin.forgotBtn')}
        onPress={handlePreviewAuthorityInfo}
      />
    </ScreenContainer>
  )
}

export default AusweisChangePin
