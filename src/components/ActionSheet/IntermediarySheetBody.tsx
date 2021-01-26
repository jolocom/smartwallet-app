import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediarySheetState } from '~/modules/interaction/types'
import { getAttributeInputType } from '~/modules/interaction/selectors'
import BasWrapper from './BasWrapper'
import { useCreateAttributes } from '~/hooks/attributes'
import { useLoader } from '~/hooks/loader'
import { strings } from '~/translations/strings'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import Form from '~/components/Form'
import { attributeConfig } from '~/config/claims'
import Input from '~/components/Input'
import { useToasts } from '~/hooks/toasts'
import useInteractionToasts from '~/hooks/interactions/useInteractionToasts'
import { mapFormFields } from '~/utils/dataMapping'
import { IAttributeClaimFieldWithValue } from '~/types/credentials'

const IntermediarySheetBody = () => {
  const dispatch = useDispatch()
  const loader = useLoader()
  const { scheduleInfo } = useToasts()
  const { scheduleErrorInteraction } = useInteractionToasts()
  const inputType = useSelector(getAttributeInputType)

  const formConfig = attributeConfig[inputType]
  const title = strings.ADD_YOUR_ATTRIBUTE(formConfig.label.toLowerCase())
  const description =
    strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION

  const createAttribute = useCreateAttributes()

  const handleSubmit = async (collectedValues: IAttributeClaimFieldWithValue[]) => {
    if (collectedValues.length) {
      const claims = mapFormFields(collectedValues);

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
                  autoFocus={i === 0}
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
