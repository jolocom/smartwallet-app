import React, { useEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { useSafeArea } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'

import Btn, { BtnSize, BtnTypes } from '~/components/Btn'
import Collapsible from '~/components/Collapsible'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import Field from '~/components/Widget/Field'
import Widget from '~/components/Widget/Widget'
import { useRedirect } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import { setPopup } from '~/modules/appState/actions'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import {
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerFAS,
} from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'
import {
  useAusweisContext,
  useAusweisInteraction,
  useCheckNFC,
  useTranslatedAusweisFields,
  useAusweisScanner,
} from '../hooks'
import {
  AusweisButtons,
  AusweisHeaderDescription,
  AusweisListSection,
  AusweisLogo,
} from '../styled'
import { AusweisPasscodeMode, AusweisScannerState, eIDScreens } from '../types'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { AusweisStackParamList } from '..'
import { CardInfo } from 'react-native-aa2-sdk/js/types'
import { ScreenNames } from '~/types/screens'
import { IField } from '~/types/props'
import moment from 'moment'
import { IS_ANDROID } from '~/utils/generic'

export const AusweisRequestReview = () => {
  const redirect = useRedirect()
  const { acceptRequest, cancelInteraction, checkCardValidity, closeAusweis } =
    useAusweisInteraction()
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
  } = useAusweisContext()
  const { checkNfcSupport } = useCheckNFC()
  const { t } = useTranslation()
  const { top } = useSafeArea()
  const navigation = useNavigation<StackNavigationProp<AusweisStackParamList>>()
  const [selectedOptional, setSelectedOptional] = useState<Array<string>>([])
  const dispatch = useDispatch()
  const translateField = useTranslatedAusweisFields()
  const { showScanner, updateScanner } = useAusweisScanner()

  useEffect(() => {
    const pinHandler = (card: CardInfo) => {
      checkCardValidity(card, () => {
        navigation.navigate(eIDScreens.EnterPIN, {
          mode: AusweisPasscodeMode.PIN,
        })
      })
    }

    const pukHandler = (card: CardInfo) => {
      checkCardValidity(card, () => {
        navigation.navigate(eIDScreens.EnterPIN, {
          mode: AusweisPasscodeMode.PUK,
        })
      })
    }

    const canHandler = (card: CardInfo) => {
      checkCardValidity(card, () => {
        navigation.navigate(eIDScreens.EnterPIN, {
          mode: AusweisPasscodeMode.CAN,
        })
      })
    }

    aa2Module.resetHandlers()
    //TODO: add badState handler and cancel
    aa2Module.setHandlers({
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner(cancelInteraction)
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
      handleAuthResult: () => {
        /**
         * NOTE: AUTH msg is sent by AA2 if user has cancelled the NFC popup on ios
         */
        if (Platform.OS === 'ios') {
          /**
           * NOTE: CANCEL should not be sent here;
           * because the workflow by this time is
           * aborted
           */
          closeAusweis()
        }
      },
    })
  }, [])

  const handleProceed = async () => {
    if (Platform.OS === 'ios') {
      dispatch(setPopup(true))
    }
    checkNfcSupport(() => {
      acceptRequest(selectedOptional)
    })
  }

  const handleIgnore = cancelInteraction

  const handleMoreInfo = () => {
    const fields: IField[] = [
      { label: 'Provider', value: providerName + '\n' + providerUrl },
      {
        label: 'Certificate issuer',
        value: certificateIssuerName + '\n' + certificateIssuerUrl,
      },
      { label: 'Provider information', value: providerInfo },
      {
        label: 'Validity',
        value:
          moment(effectiveValidityDate).format('DD.MM.YYYY') +
          ' - ' +
          moment(expirationDate).format('DD.MM.YYYY'),
      },
    ]

    redirect(ScreenNames.FieldDetails, {
      fields,
      title: providerName,
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
            <Collapsible.Scroll containerStyles={{ paddingBottom: '30%' }}>
              <Collapsible.Scale>
                <LogoContainerFAS>
                  <AusweisLogo />
                </LogoContainerFAS>
              </Collapsible.Scale>
              <Collapsible.Title text={t('CredentialRequest.header')}>
                <InteractionTitle label={t('CredentialRequest.header')} />
              </Collapsible.Title>
              <AusweisHeaderDescription>
                {`Choose one or more documents requested by ${providerName} to proceed `}
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
                More now
              </Btn>

              <ScreenContainer.Padding
                distance={BP({ large: 36, medium: 28, default: 16 })}
              >
                <AusweisListSection title="Mandatory fields">
                  {requiredFields.map((field, i) => (
                    <Field.Selectable
                      value={translateField(field)}
                      isSelected={true}
                      key={field + i}
                      disabled={true}
                    />
                  ))}
                </AusweisListSection>

                <AusweisListSection title="Optional fields">
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
        <FooterContainerFAS>
          <AusweisButtons
            submitLabel="Share"
            cancelLabel="Ignore"
            onSubmit={handleProceed}
            onCancel={handleIgnore}
          />
        </FooterContainerFAS>
      </Collapsible>
    </View>
  )
}
