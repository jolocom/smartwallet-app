import React from 'react'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { strings } from '~/translations'
import { AttributeTypes } from '~/types/credentials'
import { mapFormFields } from '~/utils/dataMapping'
import Wizard from '.'

const WIZARD_CONFIG = {
  0: {
    label: strings.WHAT_IS_YOUR_NAME,
    form: attributeConfig[AttributeTypes.name],
    submitLabel: strings.CREATE,
  },
}

const SingleCredentialWizard: React.FC<{ onFormSubmit: () => void }> = ({
  onFormSubmit,
}) => {
  const createAttribute = useCreateAttributes()

  const handleSubmit = async (fields: IFormState[]) => {
    const mappedFields = mapFormFields(fields)
    await createAttribute(AttributeTypes.name, mappedFields)
    onFormSubmit()
  }

  return (
    <Wizard config={WIZARD_CONFIG}>
      <Wizard.Header />
      <Wizard.Form onSubmit={handleSubmit} step={0} />
    </Wizard>
  )
}

export default SingleCredentialWizard
