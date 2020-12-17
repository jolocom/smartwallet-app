import React, { useEffect, useState } from 'react'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { strings } from '~/translations'
import {
  AttributeTypes,
  ClaimKeys,
  IAttributeClaimField,
} from '~/types/credentials'
import { mapFormFields } from '~/utils/dataMapping'
import Wizard from '.'

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
const WIZARD_CONFIG = {
  0: {
    label: strings.INTRODUCE_YOURSELF,
    form: nameFormConfig,
  },
  1: {
    label: strings.BEST_WAY_TO_CONTACT_YOU,
    form: emailTelephoneFormConfig,
  },
  2: {
    label: strings.WHAT_COMPANY_DO_YOU_REPRESENT,
    form: companyFormConfig,
  },
}

const SingleCredentialWizard = () => {
  const [fields, setFields] = useState<IFormState[]>([])

  const createAttribute = useCreateAttributes()

  const addFieldValues = (formFields: IFormState[]) => {
    setFields((prevState) => [...prevState, ...formFields])
  }

  useEffect(() => {
    const createNewAttribute = async () => {
      const mappedFields = mapFormFields(fields)
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
    <Wizard config={WIZARD_CONFIG}>
      <Wizard.Header />
      <Wizard.Form onSubmit={addFieldValues} step={0} />
      <Wizard.Form onSubmit={addFieldValues} step={1} />
      <Wizard.Form onSubmit={addFieldValues} step={2} />
    </Wizard>
  )
}

export default SingleCredentialWizard
