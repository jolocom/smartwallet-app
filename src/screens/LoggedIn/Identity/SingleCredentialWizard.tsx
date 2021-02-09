import React, { useRef } from 'react'
import { View } from 'react-native'
import * as yup from 'yup';

import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { strings } from '~/translations'
import { AttributeTypes } from '~/types/credentials'
import Wizard from '~/components/Wizard'

const SingleCredentialWizard: React.FC<{ onFormSubmit: () => void }> = ({
  onFormSubmit,
}) => {
  const createAttribute = useCreateAttributes()

  const WIZARD_CONFIG = useRef({
    0: {
      label: strings.WHAT_IS_YOUR_NAME,
      form: attributeConfig[AttributeTypes.name],
      submitLabel: strings.CREATE,
      validationSchema: yup.object().shape({
        givenName: yup.string().atLeastOne(['familyName'], 'Please provide at least one of the values'),
        familyName: yup.string(),
      })
    },
  }).current;

  const handleSubmit = async (fields: Record<string, string>) => {
    await createAttribute(AttributeTypes.name, fields)
    onFormSubmit()
  }

  return (
    <View testID="single-credential-wizard">
      <Wizard config={WIZARD_CONFIG}>
        <Wizard.Header />
        <Wizard.Form onSubmit={handleSubmit} step={0} />
      </Wizard>
    </View>
  )
}

export default SingleCredentialWizard
