import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { strings } from '~/translations'
import {
  AttributeTypes,
  ClaimKeys,
  IAttributeClaimField,
  IAttributeClaimFieldWithValue,
} from '~/types/credentials'
import { mapFormFields } from '~/utils/dataMapping'
import Wizard from '~/components/Wizard'

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
  },
  1: {
    label: strings.BEST_WAY_TO_CONTACT_YOU,
    form: emailTelephoneFormConfig,
    submitLabel: strings.NEXT,
  },
  2: {
    label: strings.WHAT_COMPANY_DO_YOU_REPRESENT,
    form: companyFormConfig,
    submitLabel: strings.DONE,
  },
}

const BusinessCardWizard: React.FC<{ onFormSubmit: () => void }> = ({
  onFormSubmit,
}) => {
  const [fields, setFields] = useState<IAttributeClaimFieldWithValue[]>([])

  const createAttribute = useCreateAttributes()

  const addFieldValues = (formFields: IAttributeClaimFieldWithValue[]) => {
    setFields((prevState) => [...prevState, ...formFields])
  }

  const createNewAttribute = useCallback(async () => {
    const mappedFields = mapFormFields(fields)
    await createAttribute(AttributeTypes.businessCard, mappedFields)
    onFormSubmit()
  }, [JSON.stringify(fields)])

  useEffect(() => {
    if (
      fields.length ===
      attributeConfig[AttributeTypes.businessCard].fields.length
    ) {
      createNewAttribute()
    }
  }, [JSON.stringify(fields)])

  return (
    <View testID="business-card-wizard">
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
