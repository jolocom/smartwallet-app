import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { useSafeArea } from 'react-native-safe-area-context'
import Btn, { BtnSize, BtnTypes } from '~/components/Btn'
import Collapsible from '~/components/Collapsible'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import Field from '~/components/Widget/Field'
import Widget from '~/components/Widget/Widget'
import useTranslation from '~/hooks/useTranslation'
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
import { useToasts } from '~/hooks/toasts'

export const AusweisRequestReview = () => {
  const { providerName, requiredFields, optionalFields } = useAusweisContext()
  const { scheduleWarning } = useToasts()
  const { acceptRequest, cancelFlow, checkCardValidity } =
    useAusweisInteraction()
  const { checkNfcSupport } = useCheckNFC()
  const { t } = useTranslation()
  const { top } = useSafeArea()
  const navigation = useNavigation<StackNavigationProp<AusweisStackParamList>>()
  const [selectedOptional, setSelectedOptional] = useState<Array<string>>([])
  const translateField = useTranslatedAusweisFields()
  const { showScanner, updateScanner } = useAusweisScanner()

  const handleCardValidity = (card: CardInfo, onValidCard: () => void) => {
    if (checkCardValidity(card)) {
      onValidCard()
    } else {
      cancelFlow()
      scheduleWarning({
        title: 'Oops!',
        message: 'Seems like the card you provided is not valid',
      })
    }
  }

  useEffect(() => {
    aa2Module.resetHandlers()
    //TODO: add badState handler and cancel
    aa2Module.setHandlers({
      handleCardRequest: () => {
        showScanner(() => {
          cancelFlow()
        })
      },
      handlePinRequest: (card) => {
        updateScanner({
          state: AusweisScannerState.success,
          onDone: () => {
            handleCardValidity(card, () => {
              navigation.navigate(eIDScreens.EnterPIN, {
                mode: AusweisPasscodeMode.PIN,
              })
            })
          },
        })
      },
      handlePukRequest: (card) => {
        updateScanner({
          state: AusweisScannerState.success,
          onDone: () => {
            handleCardValidity(card, () => {
              navigation.navigate(eIDScreens.EnterPIN, {
                mode: AusweisPasscodeMode.PUK,
              })
            })
          },
        })
      },
      handleCanRequest: (card) => {
        updateScanner({
          state: AusweisScannerState.success,
          onDone: () => {
            handleCardValidity(card, () => {
              navigation.navigate(eIDScreens.EnterPIN, {
                mode: AusweisPasscodeMode.CAN,
              })
            })
          },
        })
      },
    })
  }, [])

  const handleProceed = async () => {
    checkNfcSupport(() => {
      acceptRequest(selectedOptional)
    })
  }

  const handleIgnore = () => {
    cancelFlow()
  }

  const handleMoreInfo = () => {
    navigation.navigate(eIDScreens.ProviderDetails)
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
