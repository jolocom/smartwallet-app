import React from 'react'
import { useSelector } from 'react-redux'
import { getAvailableAttributesToShare } from '~/modules/interaction/selectors'
import { AttributeTypes } from '~/types/credentials'
import { attributeConfig } from '~/config/claims'
import InteractionAttributesWidget from './InteractionAttributesWidget'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import { useSwitchScreens } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'

const ShareAttributeWidget = () => {
  const attributes = useSelector(getAvailableAttributesToShare)
  const {
    handleSelectCredential,
  } = useCredentialShareFlow()
  const handleScreenSwitch = useSwitchScreens(ScreenNames.InteractionAddCredential);

  return (
    <>
      {Object.keys(attributes).map((credType) => {
        const attrType = credType as AttributeTypes
        const config = attributeConfig[attrType]
        const attribute = attributes[attrType]
        if (attribute) {
          return (
            <InteractionAttributesWidget
              key={attrType}
              name={config.label}
              type={attrType}
              onAdd={() => handleScreenSwitch({type: attrType})}
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
          )
        }
      })}
    </>
  )
}

export default ShareAttributeWidget
