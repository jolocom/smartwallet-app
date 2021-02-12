import React from 'react'
import { useDispatch } from 'react-redux'

import BasWrapper from './BasWrapper'
import { useCreateAttributes } from '~/hooks/attributes'
import { useLoader } from '~/hooks/loader'
import { strings } from '~/translations/strings'
import InteractionHeader from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionHeader'
import Form, { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { attributeConfig } from '~/config/claims'
import Input from '../Input'
import { useToasts } from '~/hooks/toasts'
import { ClaimKeys } from '~/types/credentials'
import useInteractionToasts from '~/hooks/interactions/useInteractionToasts'
import { useRoute } from '@react-navigation/native'

const IntermediarySheetBody = () => {
  const dispatch = useDispatch()
  const loader = useLoader()
  const { scheduleInfo } = useToasts()
  const { scheduleErrorInteraction } = useInteractionToasts()

  const route = useRoute()
  // TODO: fix types
  const { type: inputType } = route.params;
  
  // TODO: fix types
  const formConfig = attributeConfig[inputType]
  const title = strings.ADD_YOUR_ATTRIBUTE(formConfig.label.toLowerCase())
  const description =
    strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION

  const createAttribute = useCreateAttributes()

  const handleSubmit = async (collectedValues: IFormState[]) => {
    if (collectedValues.length) {
      const claims = collectedValues.reduce<Partial<Record<ClaimKeys, string>>>(
        (acc, v) => {
          acc[v.key] = v.value
          return acc
        },
        {},
      )

      const claimsValid = Object.values(claims).every((c) => c && !!c.length)

      if (claimsValid) {
        const success = await loader(
          async () => {
            await createAttribute(inputType, claims);
            // TODO: return user back to Interaction screen
          },
          { showSuccess: false },
        )

        if (!success) {
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
      <Form
        config={{
          key: formConfig.key,
          fields: formConfig.fields,
        }}
        onSubmit={handleSubmit}
      >
        <Form.Body>
          {({ fields, updateField }) =>
            fields.map((f, i) => {
              const isLastInput = i === fields.length - 1
              return (
                <Input.Block
                  // autoFocus={i === 0}
                  placeholder={f.label}
                  key={f.key}
                  updateInput={(val) => updateField(f.key, val)}
                  value={f.value}
                  returnKeyType={isLastInput ? 'done' : 'next'}
                  containerStyle={{ marginBottom: 8 }}
                  {...f.keyboardOptions}
                />
              )
            })
          }
        </Form.Body>
      </Form>
    </BasWrapper>
  )
}

export default IntermediarySheetBody
