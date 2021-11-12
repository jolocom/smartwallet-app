import { useNavigation } from '@react-navigation/core'
import React, { useCallback, useRef } from 'react'
import { Platform, View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { EventHandlers } from 'react-native-aa2-sdk/js/commandTypes'
import { CardInfo } from 'react-native-aa2-sdk/js/types'
import { useDispatch } from 'react-redux'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { useToasts } from '~/hooks/toasts'
import { useGoBack } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import { setPopup } from '~/modules/appState/actions'

import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { IS_ANDROID } from '~/utils/generic'

import { useAusweisInteraction, useAusweisScanner, useCheckNFC } from '../hooks'
import { AusweisPasscodeMode, AusweisScannerState, eIDScreens } from '../types'

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
              ...{btnText}
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
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { checkCardValidity, cancelFlow } = useAusweisInteraction()
  const { showScanner, updateScanner, handleDeactivatedCard } =
    useAusweisScanner()
  const { scheduleWarning } = useToasts()
  const dispatch = useDispatch()
  const isTransportPin = useRef(false)
  const goBack = useGoBack()
  const { checkNfcSupport } = useCheckNFC()

  const pinHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.EnterPIN,
        params: {
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
          mode: AusweisPasscodeMode.CAN,
          pinContext: isTransportPin.current
            ? AusweisPasscodeMode.TRANSPORT_PIN
            : undefined,
        },
      })
    })
  }, [])

  const pukHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.EnterPIN,
        params: {
          mode: AusweisPasscodeMode.PUK,
          pinContext: isTransportPin.current
            ? AusweisPasscodeMode.TRANSPORT_PIN
            : undefined,
        },
      })
    })
  }, [])

  const setupHandlers = (handlers: Partial<EventHandlers> = {}) => {
    aa2Module.resetHandlers()

    aa2Module.setHandlers({
      handleCardInfo: (card) => {
        if (card?.deactivated && IS_ANDROID) {
          handleDeactivatedCard()
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
      handleChangePinCancel: () => {},
      ...handlers,
    })
  }

  const handleChange5DigPin = () => {
    checkNfcSupport(() => {
      isTransportPin.current = true
      setupHandlers({
        handleCardRequest: () => {
          if (IS_ANDROID) {
            showScanner(() => {
              cancelFlow()
              goBack()
            })
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
      if (Platform.OS === 'ios') {
        dispatch(setPopup(true))
      }
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
