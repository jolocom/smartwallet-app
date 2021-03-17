import React from 'react'
import { useSelector } from 'react-redux'
import { View } from 'react-native'

import { getAvailableAttributesToShare } from '~/modules/interaction/selectors'
import { AttributeTypes } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import { attributeConfig } from '~/config/claims'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import { useSwitchScreens } from '~/hooks/navigation'
import InteractionAttributesWidget from './InteractionAttributesWidget'

const ShareAttributeWidget = () => {
  const attributes = useSelector(getAvailableAttributesToShare)

  if (!Object.keys(attributes).length) return null

  const { handleSelectCredential } = useCredentialShareFlow()
  const handleScreenSwitch = useSwitchScreens(
    ScreenNames.InteractionAddCredential,
  )

  return Object.keys(attributes).map((credType, idx, arr) => {
    const attrType = credType as AttributeTypes
    const config = attributeConfig[attrType]
    const attribute = attributes[attrType]
    if (attribute) {
      return (
        <React.Fragment key={idx}>
          <InteractionAttributesWidget
            key={idx}
            name={config.label}
            type={attrType}
            onAdd={() => handleScreenSwitch({ type: attrType })}
            onSelect={(attrType, id) =>
              handleSelectCredential({ [attrType]: id })
            }
            fields={attribute.map((attr) => ({
              id: attr.id,
              value: Object.values(attr.value).join(
                attrType === AttributeTypes.name ? ' ' : ', ',
              ),
            }))}
          />
          {idx !== arr.length - 1 ? <View style={{ height: 20 }} /> : null}
        </React.Fragment>
      )
    } else return null
  })
}

export default ShareAttributeWidget
