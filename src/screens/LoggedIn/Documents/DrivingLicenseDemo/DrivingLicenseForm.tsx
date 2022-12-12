import { RouteProp, useRoute } from '@react-navigation/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PersonalizationInputResponse } from 'react-native-mdl'
import { useDispatch } from 'react-redux'

import PencilIcon from '~/assets/svg/PencilIcon'
import { BottomButtons } from '~/components/BottomButtons'
import BottomSheet from '~/components/BottomSheet'
import { FormFieldContainer } from '~/components/Form/components'
import FormContainer from '~/components/FormContainer'
import InputBlock from '~/components/Input/InputBlock'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { ServiceLogo } from '~/components/ServiceLogo'
import Space from '~/components/Space'
import Field from '~/components/Widget/Field'
import Widget from '~/components/Widget/Widget'
import { useGoBack } from '~/hooks/navigation'
import { setMdoc } from '~/modules/interaction/mdl/actions'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import {
  ContainerBAS,
  LogoContainerBAS,
} from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
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
  const dispatch = useDispatch()

  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.DrivingLicenseForm>>()
  const { requests } = route.params

  const initState = requests.reduce<InputState>((acc, val) => {
    acc[val.name] = ''
    return acc
  }, {})

  const [inputs, setInputs] = useState<InputState>(initState)
  const [showBottomSheet, setShowBottomSheet] = useState(true)
  const [previousState, setPreviousState] = useState(initState)

  const isSubmitDisabled = Object.entries(inputs).every(
    ([_, value]) => !value.length,
  )

  const toggleBottomSheet = async (config?: { cancel?: boolean }) => {
    if (config && config?.cancel) {
      setInputs(previousState)
    }
    !showBottomSheet && setPreviousState(inputs)

    setShowBottomSheet(!showBottomSheet)
  }

  const drivingLicenseNumber = inputs['DL-Number']

  // TODO: replace with actual data / translations
  const serviceUrl = 'https://www.jolocom.io'
  const serviceName = t('mdl.serviceName')
  const source = 'https://avatars0.githubusercontent.com/u/4603324?s=200&v=4'

  const handleSubmit = async () => {
    const responses: PersonalizationInputResponse[] = Object.entries(
      inputs,
    ).map(([key, value]) => {
      return { name: key, value }
    })
    finishPersonalization(responses)
    goBack()
  }

  const onCancel = () => {
    dispatch(setMdoc(null))
    goBack()
  }

  return (
    <>
      {showBottomSheet ? (
        <BottomSheet onDismiss={goBack}>
          <ContainerBAS>
            <LogoContainerBAS>
              <ServiceLogo source={source} serviceUrl={serviceUrl} />
            </LogoContainerBAS>
            <InteractionTitle label={t('CredentialRequest.header')} />
            <JoloText
              kind={JoloTextKind.subtitle}
              size={JoloTextSizes.mini}
              color={Colors.white70}
              customStyles={{ paddingHorizontal: 10 }}
            >
              {t('CredentialRequest.subheader', { serviceName })}
            </JoloText>
            <Space />
            <Widget onAdd={toggleBottomSheet}>
              <Widget.Header>
                <Widget.Header.Name value={t('mdl.drivingLicenseNumber')} />
              </Widget.Header>
              {drivingLicenseNumber ? (
                <Field.Editable
                  value={drivingLicenseNumber}
                  onSelect={toggleBottomSheet}
                />
              ) : (
                <Field.Empty>
                  <PencilIcon />
                </Field.Empty>
              )}
            </Widget>
            <Space />
            <BottomButtons
              onSubmit={drivingLicenseNumber ? handleSubmit : toggleBottomSheet}
              submitLabel={
                !drivingLicenseNumber
                  ? t('CredentialShare.singleMissingAcceptBtn')
                  : t('mdl.issueMdl')
              }
              onCancel={onCancel}
              isSubmitDisabled={!drivingLicenseNumber}
            />
          </ContainerBAS>
        </BottomSheet>
      ) : (
        <FormContainer
          title={t('mdl.title')}
          description={t('mdl.description')}
          onSubmit={toggleBottomSheet}
          isSubmitDisabled={isSubmitDisabled}
          onCancel={() => toggleBottomSheet({ cancel: true })}
        >
          {requests.map((request, index) => {
            const isLastEntry = index === requests.length - 1
            return (
              <FormFieldContainer key={request.name}>
                <InputBlock
                  autoFocus={index === 0}
                  placeholder={t('mdl.drivingLicenseNumber')}
                  value={inputs[request.name]}
                  updateInput={(val) => {
                    setInputs((prev) => ({ ...prev, [request.name]: val }))
                  }}
                  returnKeyType={isLastEntry ? 'done' : 'default'}
                  onSubmitEditing={isLastEntry ? toggleBottomSheet : () => {}}
                />
              </FormFieldContainer>
            )
          })}
        </FormContainer>
      )}
    </>
  )
}
