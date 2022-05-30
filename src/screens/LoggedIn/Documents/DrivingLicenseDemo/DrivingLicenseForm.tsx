import { RouteProp, useRoute } from '@react-navigation/core'
import { prepareDataForValidation } from 'formik'
import React, { useState } from 'react'
import {
  PersonalizationInputRequest,
  PersonalizationInputResponse,
} from 'react-native-mdl'

import { FormFieldContainer } from '~/components/Form/components'
import FormContainer from '~/components/FormContainer'
import InputBlock from '~/components/Input/InputBlock'
import { useGoBack } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { MainStackParamList } from '../../Main'
import { useDrivingLicense } from './hooks'

interface InputState {
  [x: string]: string
}

export const DrivingLicenseForm = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.DrivingLicenseForm>>()
  const { requests } = route.params
  const initState = requests.reduce<InputState>((acc, val) => {
    acc[val.name] = ''
    return acc
  }, {})
  const [inputs, setInputs] = useState<InputState>(initState)
  const goBack = useGoBack()

  const { finishPersonalization } = useDrivingLicense()

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
    <FormContainer
      title={'Driving License'}
      description={
        'Submit your personal information to receive your Driving License'
      }
      onSubmit={handleSubmit}
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
  )
}
