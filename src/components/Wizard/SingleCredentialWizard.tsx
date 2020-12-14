import React from 'react'
import { attributeConfig } from '~/config/claims'
import { useCreateAttributes } from '~/hooks/attributes'
import { ClaimValues } from '~/modules/attributes/types'
import { IFormState } from '~/screens/LoggedIn/Identity/components/Form'
import { strings } from '~/translations'
import { AttributeTypes } from '~/types/credentials'
import Wizard from '.'

const WIZARD_CONFIG = {
  0: {
    label: strings.WHAT_IS_YOUR_NAME,
  },
}

const SingleCredentialWizard = () => {
  const createAttribute = useCreateAttributes()

  const handleSubmit = async (fields: IFormState[]) => {
    const mappedFields = fields.reduce<ClaimValues>((acc, v) => {
      acc[v.key] = v.value
      return acc
    }, {})
    await createAttribute(AttributeTypes.name, mappedFields)
  }

  return (
    <Wizard config={WIZARD_CONFIG} submitLabel={strings.CREATE}>
      <Wizard.Header />
      <Wizard.Form
        config={attributeConfig[AttributeTypes.name]}
        onSubmit={handleSubmit}
        step={0}
      />
    </Wizard>
  )
}

export default SingleCredentialWizard
