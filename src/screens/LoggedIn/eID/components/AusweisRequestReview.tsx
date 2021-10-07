import React, { useState } from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Collapsible from '~/components/Collapsible'
import ScreenContainer from '~/components/ScreenContainer'
import Space from '~/components/Space'
import Field from '~/components/Widget/Field'
import Widget from '~/components/Widget/Widget'
import { useDisableLock } from '~/hooks/generic'
import { useRedirect } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import InteractionSection from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionSection'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import {
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerFAS,
} from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'
import { useAusweisContext, useAusweisInteraction } from '../hooks'
import {
  AusweisButtons,
  AusweisHeaderDescription,
  AusweisLogo,
} from '../styled'

export const AusweisRequestReview = () => {
  const { scheduleWarning } = useToasts()
  const { providerName, requiredFields, optionalFields } = useAusweisContext()
  const { acceptRequest, checkIfScanned, cancelFlow } = useAusweisInteraction()
  const { t } = useTranslation()
  const { top } = useSafeArea()
  const redirect = useRedirect()
  const [selectedOptional, setSelectedOptional] = useState<Array<string>>([])
  const disableLock = useDisableLock()

  //TODO: this should probably be handled by events
  const handleProceed = async () => {
    disableLock(async () => {
      try {
        await acceptRequest(selectedOptional)
        //TODO: show the popup for android
        await checkIfScanned()
      } catch (e) {
        console.warn(e)
        scheduleWarning({
          title: 'Check compatibility',
          message:
            'Not the first time failing?\n Start compatibility diagnostics to be sure.',
          interact: {
            label: 'Start',
            onInteract: () => {
              //TODO add compatibility check
            },
          },
        })
      }

      // @ts-expect-error Add Ausweis screens to the ScreenNames enum
      redirect(AusweisScreens.EnterPIN)
    })
  }

  const handleIgnore = () => {
    cancelFlow()
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
    <View style={{ paddingTop: top, backgroundColor: Colors.mainBlack }}>
      <Collapsible
        renderHeader={() => <Collapsible.Header />}
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
                {`Please consider the details of the request sent by the ${providerName}`}
              </AusweisHeaderDescription>

              <Space />

              <ScreenContainer.Padding>
                <InteractionSection title="Mandatory">
                  {requiredFields.map((fieldName) => (
                    <Field.Static value={fieldName} />
                  ))}
                </InteractionSection>

                <InteractionSection title="Optional">
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
                </InteractionSection>
              </ScreenContainer.Padding>
            </Collapsible.Scroll>
          </ContainerFAS>
        )}
      >
        <FooterContainerFAS>
          <AusweisButtons
            submitLabel="Proceed"
            cancelLabel="Ignore"
            onSubmit={handleProceed}
            onCancel={handleIgnore}
          />
        </FooterContainerFAS>
      </Collapsible>
    </View>
  )
}
