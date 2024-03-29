import React, { useCallback, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { aa2Module } from '@jolocom/react-native-ausweis'
import { EventHandlers } from '@jolocom/react-native-ausweis/js/commandTypes'
import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { StackActions, useNavigation } from '@react-navigation/native'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Link from '~/components/Link'
import ScreenContainer from '~/components/ScreenContainer'
import { useCheckNFC } from '~/hooks/nfc'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { IS_ANDROID } from '~/utils/generic'
import { AUSWEIS_SUPPORT_EMAIL, AUSWEIS_SUPPORT_PHONE } from '../constants'
import eIDHooks from '../hooks'
import {
  AusweisFlow,
  AusweisPasscodeMode,
  AusweisScannerState,
  CardInfoMode,
  eIDScreens,
} from '../types'

interface LocalSectionProps {
  headerText: string
  descriptionText: string
}

const LocalSection: React.FC<LocalSectionProps> = ({
  headerText,
  descriptionText,
  children,
}) => (
  <View style={{ marginBottom: BP({ default: 64, xsmall: 20 }) }}>
    <ScreenContainer.Padding distance={BP({ default: 27, xsmall: 20 })}>
      <JoloText
        kind={JoloTextKind.title}
        customStyles={{ marginBottom: BP({ large: 12, default: 8 }) }}
      >
        {headerText}
      </JoloText>
      <JoloText color={Colors.osloGray}>{descriptionText}</JoloText>
      {children}
    </ScreenContainer.Padding>
  </View>
)

const AusweisChangePin = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { checkCardValidity, cancelFlow, startChangePin } =
    eIDHooks.useAusweisInteraction()
  const { showScanner, updateScanner } = eIDHooks.useAusweisScanner()
  const { handleDeactivatedCard } = eIDHooks.useDeactivatedCard()
  const isTransportPin = useRef(false)
  const { usePendingEidHandler } = eIDHooks
  const checkNfcSupport = useCheckNFC()

  const changePinFlow =
    isTransportPin.current === true
      ? AusweisFlow.changeTransportPin
      : AusweisFlow.changePin

  const pinHandler = useCallback((card: CardInfo) => {
    const params = {
      screen: ScreenNames.eId,
      params: {
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
      },
    }

    checkCardValidity(card, () => {
      if (isTransportPin.current) {
        // NOTE: special behavior for transport PIN due to the intermediary screen
        navigation.dispatch(
          StackActions.replace(ScreenNames.Interaction, params),
        )
      } else {
        navigation.navigate(ScreenNames.Interaction, params)
      }
    })
  }, [])

  const canHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.Interaction, {
        screen: ScreenNames.eId,
        params: {
          screen: eIDScreens.EnterPIN,
          params: {
            flow: changePinFlow,
            mode: AusweisPasscodeMode.CAN,
            pinContext: isTransportPin.current
              ? AusweisPasscodeMode.TRANSPORT_PIN
              : undefined,
          },
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
        onDismiss: () => {
          cancelFlow()
          navigation.goBack()
        },
      },
    })
  }, [])

  const setupHandlers = (handlers: Partial<EventHandlers> = {}) => {
    aa2Module.resetHandlers()

    aa2Module.setHandlers({
      handleCardInfo: (card) => {
        if (card?.deactivated) {
          handleDeactivatedCard()
        }
      },
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner({ onDismiss: cancelFlow })
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

  const change5DigPin = () => {
    checkNfcSupport(() => {
      isTransportPin.current = true
      setupHandlers({
        handleCardInfo: (card) => {
          if (card?.deactivated) {
            handleDeactivatedCard()
          }
        },
        handleChangePinCancel: () => navigation.goBack(),
      })
      navigation.navigate(ScreenNames.Interaction, {
        screen: ScreenNames.eId,
        params: {
          screen: eIDScreens.AusweisTransportWarning,
        },
      })
    })
  }

  const change6DigPin = () => {
    checkNfcSupport(() => {
      isTransportPin.current = false
      setupHandlers()
      startChangePin()
    })
  }

  const { handlePress: handle5DigPin, isLoading: isLoading5DigPin } =
    usePendingEidHandler(change5DigPin)

  const { handlePress: handle6DigPin, isLoading: isLoading6DigPin } =
    usePendingEidHandler(change6DigPin)

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'space-around' }}
      backgroundColor={Colors.mainDark}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        style={{ width: '100%' }}
      >
        <LocalSection
          headerText={t('AusweisChangePin.transportPinHeader')}
          descriptionText={t('AusweisChangePin.transportPinSubheader')}
        >
          <Btn
            loading={isLoading5DigPin}
            onPress={handle5DigPin}
            type={BtnTypes.quaternary}
            customTextStyles={{ opacity: 1 }}
          >
            {t('AusweisChangePin.transportPinBtn')}
          </Btn>
        </LocalSection>
        <LocalSection
          headerText={t('AusweisChangePin.pinHeader')}
          descriptionText={t('AusweisChangePin.pinSubheader')}
        >
          <Btn
            loading={isLoading6DigPin}
            onPress={handle6DigPin}
            type={BtnTypes.quaternary}
            customTextStyles={{ opacity: 1 }}
          >
            {t('AusweisChangePin.pinBtn')}
          </Btn>
        </LocalSection>
        <LocalSection
          headerText={t('AusweisChangePin.forgotHeader')}
          descriptionText={t('AusweisChangePin.forgotSubheader')}
        >
          <Link
            url={`mailto:${AUSWEIS_SUPPORT_EMAIL}`}
            customStyles={{ marginTop: 32 }}
          >
            {AUSWEIS_SUPPORT_EMAIL}
          </Link>
          <Link
            url={`tel:${AUSWEIS_SUPPORT_PHONE}`}
            customStyles={{ marginTop: 32 }}
          >
            {AUSWEIS_SUPPORT_PHONE}
          </Link>
        </LocalSection>
      </ScrollView>
    </ScreenContainer>
  )
}

export default AusweisChangePin
