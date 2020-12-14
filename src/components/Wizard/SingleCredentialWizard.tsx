import React, { useEffect, useState } from 'react'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { ClaimValues } from '~/modules/attributes/types'
import Form, {
  IFormContext,
  IFormState,
} from '~/screens/LoggedIn/Identity/components/Form'
import { strings } from '~/translations'
import {
  AttributeTypes,
  ClaimKeys,
  IAttributeClaimField,
} from '~/types/credentials'
import Wizard from '.'
import Input from '../Input'
import WizardFooter from './WizardFooter'

const CONFIG = {
  0: {
    label: strings.INTRODUCE_YOURSELF,
  },
  1: {
    label: strings.BEST_WAY_TO_CONTACT_YOU,
  },
  2: {
    label: strings.WHAT_COMPANY_DO_YOU_REPRESENT,
  },
}

const getFormSlice = (...claimskeys: ClaimKeys[]) => {
  const config = attributeConfig[AttributeTypes.businessCard]
  const selectedFields = config.fields.reduce<IAttributeClaimField[]>(
    (acc, v) => {
      if (claimskeys.includes(v.key)) {
        acc = [...acc, v]
      }
      return acc
    },
    [],
  )
  return { ...config, fields: selectedFields }
}

const nameFormConfig = getFormSlice(ClaimKeys.givenName, ClaimKeys.familyName)
const emailTelephoneFormConfig = getFormSlice(
  ClaimKeys.email,
  ClaimKeys.telephone,
)
const companyFormConfig = getFormSlice(ClaimKeys.legalCompanyName)

const SingleCredentialWizard = () => {
  const [fields, setFields] = useState<IFormState[]>([])

  const createAttribute = useCreateAttributes()

  const addFieldValues = (formFields: IFormState[]) => {
    setFields((prevState) => [...prevState, ...formFields])
  }

  useEffect(() => {
    const createNewAttribute = async () => {
      const mappedFields = fields.reduce<ClaimValues>((acc, v) => {
        acc[v.key] = v.value
        return acc
      }, {})
      await createAttribute(AttributeTypes.businessCard, mappedFields)
    }
    if (
      fields.length ===
      attributeConfig[AttributeTypes.businessCard].fields.length
    ) {
      createNewAttribute()
    }
  }, [JSON.stringify(fields)])

  return (
    <Wizard config={CONFIG}>
      <Wizard.Header />
      <Wizard.Body step={0}>
        <Form config={nameFormConfig}>
          <Form.Body>
            {({ fields, updateField }) =>
              fields.map((field, idx) => (
                <Input.Block
                  {...field}
                  autoFocus={idx === 0}
                  placeholder={field.label}
                  updateInput={(val) => updateField(field.key, val)}
                />
              ))
            }
          </Form.Body>
          <Form.Expose>
            {({ fields }: IFormContext) => (
              <WizardFooter onSubmit={() => addFieldValues(fields)} />
            )}
          </Form.Expose>
        </Form>
      </Wizard.Body>
      <Wizard.Body step={1}>
        <Form config={emailTelephoneFormConfig}>
          <Form.Body>
            {({ fields, updateField }) =>
              fields.map((field, idx) => (
                <Input.Block
                  {...field}
                  autoFocus={idx === 0}
                  placeholder={field.label}
                  updateInput={(val) => updateField(field.key, val)}
                />
              ))
            }
          </Form.Body>
          <Form.Expose>
            {({ fields }: IFormContext) => (
              <WizardFooter onSubmit={() => addFieldValues(fields)} />
            )}
          </Form.Expose>
        </Form>
      </Wizard.Body>
      <Wizard.Body step={2}>
        <Form config={companyFormConfig}>
          <Form.Body>
            {({ fields, updateField }) =>
              fields.map((field, idx) => (
                <Input.Block
                  {...field}
                  autoFocus={idx === 0}
                  placeholder={field.label}
                  updateInput={(val) => updateField(field.key, val)}
                />
              ))
            }
          </Form.Body>
          <Form.Expose>
            {({ fields }: IFormContext) => (
              <WizardFooter onSubmit={() => addFieldValues(fields)} />
            )}
          </Form.Expose>
        </Form>
      </Wizard.Body>
    </Wizard>
  )
}

export default SingleCredentialWizard
