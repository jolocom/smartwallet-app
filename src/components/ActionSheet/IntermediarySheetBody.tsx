import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik'

import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediarySheetState } from '~/modules/interaction/types'
import { getAttributeInputType } from '~/modules/interaction/selectors'
import BasWrapper from './BasWrapper'
import { useCreateAttributes } from '~/hooks/attributes'
import { useLoader } from '~/hooks/loader'
import { strings } from '~/translations/strings'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import { attributeConfig } from '~/config/claims'
import Input from '~/components/Input'
import { useToasts } from '~/hooks/toasts'
import useInteractionToasts from '~/hooks/interactions/useInteractionToasts'
import { assembleFormInitialValues } from '~/utils/dataMapping'

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const IntermediarySheetBody = () => {
  const dispatch = useDispatch()
  const loader = useLoader()
  const { scheduleInfo } = useToasts()
  const { scheduleErrorInteraction } = useInteractionToasts()
  const inputType = useSelector(getAttributeInputType)

  const formConfig = attributeConfig[inputType]
  const initialValues = assembleFormInitialValues(formConfig.fields)
  const title = strings.ADD_YOUR_ATTRIBUTE(formConfig.label.toLowerCase())
  const description =
    strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION

  const createAttribute = useCreateAttributes()

  const handleSubmit = async (claims: Record<string, string>) => {
    if (Object.keys(claims).length) {
      // TODO: update check of non-primitive validity
      const claimsValid = Object.values(claims).every((c) => c && !!c.length)

      if (claimsValid) {
        const success = await loader(
          async () => {
            await createAttribute(inputType, claims)
            dispatch(setIntermediaryState(IntermediarySheetState.switching))
          },
          { showSuccess: false },
        )

        if (!success) {
          dispatch(setIntermediaryState(IntermediarySheetState.switching))
          scheduleErrorInteraction()
        }
      } else {
        scheduleInfo({
          title: 'Oops',
          message: 'You need to fill in all the fields',
        })
      }
    } else {
      // TODO: focus keyboard
    }
  }

  return (
    <BasWrapper
      showIcon={false}
      customStyles={{
        paddingTop: 10,
      }}
    >
      <InteractionHeader {...{ title, description }} />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleChange, values }) => (
          <AutofocusContainer>
            {formConfig.fields.map((field, i) => {
              return (
                <AutofocusInput
                  // @ts-ignore no idea why it's complaining
                  name={field.key as string}
                  autoFocus={i === 0}
                  placeholder={field.label}
                  updateInput={handleChange(field.key)}
                  key={field.key}
                  value={values[field.key]}
                  containerStyle={{ marginBottom: 8 }}
                  {...field.keyboardOptions}
                />
              )
            })}
          </AutofocusContainer>
        )}
      </Formik>
    </BasWrapper>
  )
}

export default IntermediarySheetBody
