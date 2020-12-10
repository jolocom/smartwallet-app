import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setIntermediaryState } from '~/modules/interaction/actions'
import { IntermediarySheetState } from '~/modules/interaction/types'
import { getAttributeInputType } from '~/modules/interaction/selectors'
import BasWrapper from './BasWrapper'
import { useCreateAttributes } from '~/hooks/attributes'
import { useLoader } from '~/hooks/loader'
import { strings } from '~/translations/strings'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import Form, { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { attributeConfig } from '~/config/claims'
import Input from '../Input'
import { useToasts } from '~/hooks/toasts'
import { ClaimKeys } from '~/types/credentials'

const IntermediarySheetBody = () => {
  const dispatch = useDispatch()
  const loader = useLoader()
  const { scheduleInfo, scheduleWarning } = useToasts()
  const inputType = useSelector(getAttributeInputType)

  const formConfig = attributeConfig[inputType]
  const title = strings.ADD_YOUR_ATTRIBUTE(formConfig.label.toLowerCase())
  const description =
    strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION

  const formStateRef = useRef<{ state: IFormState[] }>(null)
  const createAttribute = useCreateAttributes()

  const handleSubmit = async () => {
    if (formStateRef.current) {
      const claims = formStateRef.current.state.reduce<
        Partial<Record<ClaimKeys, string>>
      >((acc, v) => {
        acc[v.key] = v.value
        return acc
      }, {})

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
          scheduleWarning({
            title: 'Oops',
            message: 'Failed to create attribute!',
          })
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
        ref={formStateRef}
        config={{
          id: formConfig.key,
          fields: formConfig.fields,
        }}
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
                  onSubmitEditing={handleSubmit}
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
