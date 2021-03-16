import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { View } from 'react-native'

import {
  getAvailableAttributesToShare,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import { AttributeTypes } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import { attributeConfig } from '~/config/claims'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import { useSwitchScreens } from '~/hooks/navigation'

import InteractionAttributesWidget from './InteractionAttributesWidget'
import { AttributeWidgetContainerFAS } from '~/screens/Modals/Interaction/InteractionFlow/components/styled'

interface IShareAttributeWidgetProps {
  withContainer?: boolean
}

const ShareAttributeWidget: React.FC<IShareAttributeWidgetProps> = ({
  withContainer = false,
}) => {
  const attributes = useSelector(getAvailableAttributesToShare)
  const selectedCredentials = useSelector(getSelectedShareCredentials)

  if (!Object.keys(attributes).length) return null

  const { handleSelectCredential } = useCredentialShareFlow()
  const handleScreenSwitch = useSwitchScreens(
    ScreenNames.InteractionAddCredential,
  )
  const Container = withContainer ? AttributeWidgetContainerFAS : React.Fragment

  /* Preselecting first requested attribute */
  useEffect(() => {
    Object.keys(attributes).forEach((type) => {
      const t = type as AttributeTypes
      /* checking for selected credentials too as otherwise the first one is always selected */
      if (attributes[t]?.length && !selectedCredentials[t]) {
        handleSelectCredential({ [t]: attributes[t][0].id })
      }
    })
  }, [])

  return (
    <Container>
      {Object.keys(attributes).map((credType, idx, arr) => {
        const attrType = credType as AttributeTypes
        const config = attributeConfig[attrType]
        const attribute = attributes[attrType]
        if (attribute) {
          return (
            <View key={credType}>
              <InteractionAttributesWidget
                key={attrType}
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
            </View>
          )
        }
      })}
    </Container>
  )
}

export default ShareAttributeWidget
