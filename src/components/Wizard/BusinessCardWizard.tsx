import React, { useEffect, useState } from 'react'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { ClaimValues } from '~/modules/attributes/types'
import { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { strings } from '~/translations'
import {
  AttributeTypes,
  ClaimKeys,
  IAttributeClaimField,
} from '~/types/credentials'
import Wizard from '.'

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
      <Wizard.Form config={nameFormConfig} onSubmit={addFieldValues} step={0} />
      <Wizard.Form
        config={emailTelephoneFormConfig}
        onSubmit={addFieldValues}
        step={1}
      />
      <Wizard.Form
        config={companyFormConfig}
        onSubmit={addFieldValues}
        step={2}
      />
    </Wizard>
  )
}

export default SingleCredentialWizard
