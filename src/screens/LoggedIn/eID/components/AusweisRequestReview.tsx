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
import { useRedirect } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import {
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerFAS,
} from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'
import { useAusweisContext, useAusweisInteraction, useCheckNFC } from '../hooks'
import {
  AusweisButtons,
  AusweisHeaderDescription,
  AusweisListSection,
  AusweisLogo,
} from '../styled'
import { AusweisPasscodeMode, eIDScreens } from '../types'
import { SWErrorCodes } from '~/errors/codes'

export const AusweisRequestReview = () => {
  const { scheduleErrorWarning } = useToasts()
  const { providerName, requiredFields, optionalFields } = useAusweisContext()
  const { acceptRequest, cancelFlow } = useAusweisInteraction()
  const { checkNfcSupport, scheduleDisabledNfcToast } = useCheckNFC()
  const { t } = useTranslation()
  const { top } = useSafeArea()
  const redirect = useRedirect()
  const [selectedOptional, setSelectedOptional] = useState<Array<string>>([])

  useEffect(() => {
    aa2Module.resetHandlers()
    aa2Module.setHandlers({
      handleCardRequest: () => {
        //@ts-expect-error
        redirect(eIDScreens.AusweisScanner)
      },
      handlePinRequest: () => {
        //@ts-expect-error
        redirect(eIDScreens.EnterPIN, { mode: AusweisPasscodeMode.PIN })
      },
      handlePukRequest: () => {
        //@ts-expect-error
        redirect(eIDScreens.EnterPIN, { mode: AusweisPasscodeMode.PUK })
      },
      handleCanRequest: () => {
        //@ts-expect-error
        redirect(eIDScreens.EnterPIN, { mode: AusweisPasscodeMode.CAN })
      },
    })
  }, [])

  const handleProceed = async () => {
    try {
      await checkNfcSupport()
      await acceptRequest(selectedOptional)
    } catch (e) {
      if (e.message === SWErrorCodes.SWNfcNotEnabled) {
        scheduleDisabledNfcToast()
      } else {
        console.warn('Error: ', e)
        scheduleErrorWarning(e)
        cancelFlow()
      }
    }
  }

  const handleIgnore = () => {
    cancelFlow()
  }

  const handleMoreInfo = () => {
    // @ts-expect-error
    redirect(eIDScreens.ProviderDetails)
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
                  {requiredFields.map((fieldName) => (
                    <Field.Static value={fieldName} />
                  ))}
                </AusweisListSection>

                <AusweisListSection title="Optional fields">
                  <Widget>
                    {optionalFields.map((field, i) => (
                      <Field.Selectable
                        key={field + i}
                        value={field}
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
