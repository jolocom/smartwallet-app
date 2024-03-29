import { aa2Module } from '@jolocom/react-native-ausweis'
import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Btn, { BtnSize, BtnTypes } from '~/components/Btn'
import Collapsible from '~/components/Collapsible'
import ScreenContainer from '~/components/ScreenContainer'
import { ServiceLogo } from '~/components/ServiceLogo'
import Field from '~/components/Widget/Field'
import Widget from '~/components/Widget/Widget'
import { PropertyMimeType } from '~/hooks/documents/types'
import { useRedirect } from '~/hooks/navigation'
import { useCheckNFC } from '~/hooks/nfc'
import useTranslation from '~/hooks/useTranslation'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import {
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerFAS,
} from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { IField } from '~/types/props'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { IS_ANDROID } from '~/utils/generic'
import { AusweisStackParamList } from '..'
import eIDHooks from '../hooks'
import {
  AusweisButtons,
  AusweisHeaderDescription,
  AusweisListSection,
} from '../styled'
import {
  AusweisFlow,
  AusweisPasscodeMode,
  AusweisScannerState,
  eIDScreens,
} from '../types'

type AusweisRequestReviewNavigation = StackNavigationProp<
  AusweisStackParamList,
  eIDScreens.RequestDetails
>

export const AusweisRequestReview = () => {
  const redirect = useRedirect()
  const {
    acceptRequest,
    cancelInteraction,
    checkCardValidity,
    closeAusweis,
    sendCancel,
  } = eIDHooks.useAusweisInteraction()
  const {
    providerName,
    requiredFields,
    optionalFields,
    providerUrl,
    certificateIssuerName,
    certificateIssuerUrl,
    providerInfo,
    effectiveValidityDate,
    expirationDate,
  } = eIDHooks.useAusweisContext()
  const checkNfcSupport = useCheckNFC()
  const { t } = useTranslation()
  const { top } = useSafeArea()
  const navigation = useNavigation<AusweisRequestReviewNavigation>()
  const [selectedOptional, setSelectedOptional] = useState<Array<string>>([])
  const translateField = eIDHooks.useTranslatedAusweisFields()
  const { updateScanner, showScanner } = eIDHooks.useAusweisScanner()
  const { handleDeactivatedCard } = eIDHooks.useDeactivatedCard()

  eIDHooks.useAusweisCancelBackHandler()

  useEffect(() => {
    const pinHandler = (card: CardInfo) => {
      checkCardValidity(card, () => {
        navigation.navigate(eIDScreens.EnterPIN, {
          flow: AusweisFlow.auth,
          mode: AusweisPasscodeMode.PIN,
        })
      })
    }

    const pukHandler = (card: CardInfo) => {
      checkCardValidity(card, () => {
        navigation.navigate(eIDScreens.EnterPIN, {
          flow: AusweisFlow.auth,
          mode: AusweisPasscodeMode.PUK,
        })
      })
    }

    const canHandler = (card: CardInfo) => {
      checkCardValidity(card, () => {
        navigation.navigate(eIDScreens.EnterPIN, {
          flow: AusweisFlow.auth,
          mode: AusweisPasscodeMode.CAN,
        })
      })
    }

    aa2Module.resetHandlers()
    //TODO: add badState handler and cancel
    aa2Module.setHandlers({
      handleCardInfo: (card) => {
        if (card?.deactivated) {
          handleDeactivatedCard()
        }
      },
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner({ onDismiss: cancelInteraction, isInsideEidStack: true })
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
      handleAuthFailed: (url: string, message: string) => {
        /**
         * NOTE: AUTH msg is sent by AA2 if user has cancelled the NFC popup on ios
         */
        if (Platform.OS === 'ios') {
          closeAusweis()
        }
      },
    })
  }, [])

  const handleProceed = async () => {
    checkNfcSupport(() => {
      acceptRequest(selectedOptional)
    })
  }

  // FIXME: weird navigation behavior for iOS. popStack() in cancelInteraction takes user
  // back to home screen instead of scanner. The ternary below fixes the issue.
  const handleIgnore = IS_ANDROID ? cancelInteraction : sendCancel

  const handleMoreInfo = () => {
    const fields: IField[] = [
      {
        label: t('AusweisProvider.providerLabel'),
        value: providerName + '\n' + providerUrl,
        mime_type: PropertyMimeType['text_plain'],
      },
      {
        label: t('AusweisProvider.certificateLabel'),
        value: certificateIssuerName + '\n' + certificateIssuerUrl,
        mime_type: PropertyMimeType['text_plain'],
      },
      {
        label: t('AusweisProvider.providerInfoLabel'),
        value: providerInfo,
        mime_type: PropertyMimeType['text_plain'],
      },
      {
        label: t('AusweisProvider.validityLabel'),
        value:
          moment(effectiveValidityDate).format('DD.MM.YYYY') +
          ' - ' +
          moment(expirationDate).format('DD.MM.YYYY'),
        mime_type: PropertyMimeType['text_plain'],
      },
    ]

    redirect(ScreenNames.AusweisServiceInfo, {
      eIdData: { title: providerName, fields },
      backgroundColor: Colors.mainDark,
    })
  }

  const handleSelectOptional = (field: string) => {
    setSelectedOptional((prevState) => {
      if (prevState.includes(field)) {
        return prevState.filter((f) => f !== field)
      } else {
        return [...prevState, field]
      }
    })
  }

  return (
    <View style={{ paddingTop: top, backgroundColor: Colors.mainDark }}>
      <Collapsible
        renderHeader={() => (
          <Collapsible.Header
            customStyles={{ backgroundColor: Colors.mainDark }}
          />
        )}
        renderScroll={() => (
          <ContainerFAS>
            <Collapsible.Scroll containerStyles={{ paddingBottom: '15%' }}>
              <Collapsible.Scale>
                <LogoContainerFAS>
                  <ServiceLogo />
                </LogoContainerFAS>
              </Collapsible.Scale>
              <Collapsible.Title text={t('Ausweis.header')}>
                <InteractionTitle label={t('Ausweis.header')} />
              </Collapsible.Title>
              <ScreenContainer.Padding distance={20}>
                <AusweisHeaderDescription>
                  {t('AusweisReview.subheader', {
                    serviceName: providerName,
                    interpolation: {
                      escapeValue: false,
                    },
                  })}
                </AusweisHeaderDescription>
                <Btn
                  type={BtnTypes.septenary}
                  size={BtnSize.small}
                  onPress={handleMoreInfo}
                  customContainerStyles={{
                    width: 'auto',
                    paddingHorizontal: 24,
                    marginBottom: 32,
                    marginTop: 20,
                  }}
                >
                  {t('AusweisReview.providerBtn')}
                </Btn>

                <AusweisListSection
                  isVisible={!!requiredFields.length}
                  title={t('AusweisReview.mandatoryHeader')}
                >
                  {requiredFields.map((field, i) => (
                    <Field.Selectable
                      value={translateField(field)}
                      isSelected={true}
                      key={field + i}
                      disabled={true}
                    />
                  ))}
                </AusweisListSection>

                <AusweisListSection
                  isVisible={!!optionalFields.length}
                  title={t('AusweisReview.optionalHeader')}
                >
                  <Widget>
                    {optionalFields.map((field, i) => (
                      <Field.Selectable
                        key={field + i}
                        value={translateField(field)}
                        onSelect={() => handleSelectOptional(field)}
                        isSelected={selectedOptional.includes(field)}
                      />
                    ))}
                  </Widget>
                </AusweisListSection>
              </ScreenContainer.Padding>
            </Collapsible.Scroll>
          </ContainerFAS>
        )}
      >
        <FooterContainerFAS
          customStyles={{
            paddingHorizontal: 20,
          }}
        >
          <AusweisButtons
            submitLabel={t('AusweisReview.proceedBtn')}
            cancelLabel={t('Interaction.cancelBtn')}
            onSubmit={handleProceed}
            onCancel={handleIgnore}
          />
        </FooterContainerFAS>
      </Collapsible>
    </View>
  )
}
