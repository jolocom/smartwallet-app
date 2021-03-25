import React from 'react'
import { AttributeTypes } from '~/types/credentials'
import { useRedirect } from '~/hooks/navigation'
import { TouchableOpacity } from 'react-native'
import { ScreenNames } from '~/types/screens'
import Field from '~/components/Widget/Field'

interface Props {
  type: AttributeTypes
  id: string
  value: string
}

const IdentityField: React.FC<Props> = ({ type, id, value }) => {
  const redirect = useRedirect()

  return (
    <TouchableOpacity
      onPress={() =>
        redirect(ScreenNames.CredentialForm, {
          type,
          id,
        })
      }
      key={id}
    >
      <Field.Static key={id} value={value} />
    </TouchableOpacity>
  )
}

export default IdentityField
