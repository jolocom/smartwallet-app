import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { strings } from '~/translations'
import {
  AttributeTypes,
  ClaimKeys,
  IAttributeClaimField,
} from '~/types/credentials'
import Wizard from '~/components/Wizard'
import { companyValidation, contactValidation, nameValidation } from '~/config/validation'

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
    submitLabel: strings.NEXT,
    validationSchema: nameValidation
  },
  1: {
    label: strings.BEST_WAY_TO_CONTACT_YOU,
    form: emailTelephoneFormConfig,
    submitLabel: strings.NEXT,
    validationSchema: contactValidation
  },
  2: {
    label: strings.WHAT_COMPANY_DO_YOU_REPRESENT,
    form: companyFormConfig,
    submitLabel: strings.DONE,
    validationSchema: companyValidation
  },
}

const BusinessCardWizard: React.FC<{ onFormSubmit: () => void }> = ({
  onFormSubmit,
}) => {
  const [fields, setFields] = useState<Record<string, string>>({})

  const createAttribute = useCreateAttributes()

  const addFieldValues = (fields: Record<string, string>) => {
    setFields((prevState) => ({ ...prevState, ...fields }))
  }

  const createNewAttribute = useCallback(async () => {
    await createAttribute(AttributeTypes.businessCard, fields)
    onFormSubmit()
  }, [JSON.stringify(fields)])

  useEffect(() => {
    if (
      Object.keys(fields).length ===
      attributeConfig[AttributeTypes.businessCard].fields.length
    ) {
      createNewAttribute()
    }
  }, [JSON.stringify(fields)])

  return (
    <View testID="business-card-wizard">
      {/* TODO: fix types */}
      <Wizard config={WIZARD_CONFIG}>
        <Wizard.Header />
        <Wizard.Form onSubmit={addFieldValues} step={0} />
        <Wizard.Form onSubmit={addFieldValues} step={1} />
        <Wizard.Form onSubmit={addFieldValues} step={2} />
      </Wizard>
    </View>
  )
}

export default BusinessCardWizard
