import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PersonalizationInputResponse } from 'react-native-mdl'
import { RouteProp, useRoute } from '@react-navigation/core'

import PencilIcon from '~/assets/svg/PencilIcon'
import { BottomButtons } from '~/components/BottomButtons'
import BottomSheet from '~/components/BottomSheet'
import FormContainer from '~/components/FormContainer'
import { FormFieldContainer } from '~/components/Form/components'
import InputBlock from '~/components/Input/InputBlock'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { ServiceLogo } from '~/components/ServiceLogo'
import Space from '~/components/Space'
import Field from '~/components/Widget/Field'
import Widget from '~/components/Widget/Widget'
import { useGoBack } from '~/hooks/navigation'
import {
  ContainerBAS,
  LogoContainerBAS,
} from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

import { MainStackParamList } from '../../Main'
import { useDrivingLicense } from './hooks'

interface InputState {
  [x: string]: string
}

export const DrivingLicenseForm = () => {
  const goBack = useGoBack()
  const { finishPersonalization } = useDrivingLicense()
  const { t } = useTranslation()

  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.DrivingLicenseForm>>()
  const { requests } = route.params

  const initState = requests.reduce<InputState>((acc, val) => {
    acc[val.name] = ''
    return acc
  }, {})

  const [inputs, setInputs] = useState<InputState>(initState)
  const [showBottomSheet, setShowBottomSheet] = useState(true)

  const drivingLicensNumber = inputs['DL-Number']

  const handleSubmit = async () => {
    const responses: PersonalizationInputResponse[] = Object.entries(
      inputs,
    ).map(([key, value]) => {
      return { name: key, value }
    })
    finishPersonalization(responses)
    goBack()
  }

  const isSubmitDisabled = Object.entries(inputs).every(
    ([_, value]) => !value.length,
  )

  return (
    <>
      {showBottomSheet ? (
        <BottomSheet onDismiss={goBack}>
          <ContainerBAS>
            <LogoContainerBAS>
              <ServiceLogo
                source={
                  'https://avatars0.githubusercontent.com/u/4603324?s=200&v=4'
                }
                serviceUrl={'https://www.jolocom.io'}
              />
            </LogoContainerBAS>
            <InteractionTitle label={t('CredentialRequest.header')} />
            <JoloText
              kind={JoloTextKind.subtitle}
              size={JoloTextSizes.mini}
              color={Colors.white70}
              customStyles={{ paddingHorizontal: 10 }}
            >
              Choose one or more documents requested serviceName by to proceed
            </JoloText>
            <Space />
            <Widget
              onAdd={() => {
                setShowBottomSheet(false)
              }}
            >
              <Widget.Header>
                <Widget.Header.Name value={'Driving License Number'} />
              </Widget.Header>
              {drivingLicensNumber ? (
                <Field.Static value={drivingLicensNumber} />
              ) : (
                <Field.Empty>
                  <PencilIcon />
                </Field.Empty>
              )}
            </Widget>
            <Space />
            <BottomButtons
              onSubmit={
                drivingLicensNumber ? handleSubmit : setShowBottomSheet(false)
              }
              submitLabel={!drivingLicensNumber ? 'add info' : 'issue mdl'}
              onCancel={() => goBack()}
              isSubmitDisabled={!drivingLicensNumber}
            />
          </ContainerBAS>
        </BottomSheet>
      ) : (
        <FormContainer
          title={'Führerschein'}
          description={
            'Geben Sie Ihre Personendaten ein, um Ihren digitalen Führerschein zu erhalten'
          }
          onSubmit={() => {
            setShowBottomSheet(true)
          }}
          isSubmitDisabled={isSubmitDisabled}
        >
          {requests.map((request) => {
            return (
              <FormFieldContainer key={request.name}>
                <InputBlock
                  placeholder={request.description}
                  value={inputs[request.name]}
                  updateInput={(val) => {
                    setInputs((prev) => ({ ...prev, [request.name]: val }))
                  }}
                />
              </FormFieldContainer>
            )
          })}
        </FormContainer>
      )}
    </>
  )
}
