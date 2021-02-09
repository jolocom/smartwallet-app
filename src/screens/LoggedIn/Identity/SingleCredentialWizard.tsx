import React, { useRef } from 'react'
import { View } from 'react-native'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { strings } from '~/translations'
import { AttributeTypes } from '~/types/credentials'
import Wizard from '~/components/Wizard'
import { nameValidation } from '~/config/validation'

const WIZARD_CONFIG = {
  0: {
    label: strings.WHAT_IS_YOUR_NAME,
    form: attributeConfig[AttributeTypes.name],
    submitLabel: strings.CREATE,
    validationSchema: nameValidation
  },
};

const SingleCredentialWizard: React.FC<{ onFormSubmit: () => void }> = ({
  onFormSubmit,
}) => {
  const createAttribute = useCreateAttributes()


  const handleSubmit = async (fields: Record<string, string>) => {
    await createAttribute(AttributeTypes.name, fields)
    onFormSubmit()
  }

  return (
    <View testID="single-credential-wizard">
      {/* TODO: fix types */}
      <Wizard config={WIZARD_CONFIG}>
        <Wizard.Header />
        <Wizard.Form onSubmit={handleSubmit} step={0} />
      </Wizard>
    </View>
  )
}

export default SingleCredentialWizard
