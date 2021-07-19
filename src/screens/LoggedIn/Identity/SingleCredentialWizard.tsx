import React from 'react'
import { View } from 'react-native'
import { attributeConfig } from '~/config/claims'
import { useSICActions } from '~/hooks/attributes'
import { AttributeTypes } from '~/types/credentials'
import Wizard from '~/components/Wizard'
import { nameValidation } from '~/config/validation'
import { trimObjectValues } from '~/utils/stringUtils'
import useTranslation from '~/hooks/useTranslation'

const SingleCredentialWizard: React.FC<{ onFormSubmit: () => void }> = ({
  onFormSubmit,
}) => {
  const { handleCreateCredentialSI } = useSICActions()
  const { t } = useTranslation()

  const WIZARD_CONFIG = {
    0: {
      label: t('Identity.widgetNameHeader'),
      form: attributeConfig[AttributeTypes.name],
      submitLabel: t('Identity.widgetConfirmBtn'),
      validationSchema: nameValidation,
    },
  }

  const handleSubmit = async (fields: Record<string, string>) => {
    fields = trimObjectValues(fields)
    await handleCreateCredentialSI(
      AttributeTypes.name,
      fields,
      attributeConfig[AttributeTypes.name].metadata,
    )
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
