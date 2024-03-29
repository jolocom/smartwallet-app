import React, { Children, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, View } from 'react-native'

import {
  getRequestedAttributes,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import { AttributeTypes } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import { attributeConfig } from '~/config/claims'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import { useRedirect } from '~/hooks/navigation'

import { Colors } from '~/utils/colors'
import Field, { IWidgetField } from '~/components/Widget/Field'
import Widget from '~/components/Widget/Widget'
import Space from '~/components/Space'
import {
  concatValuesShare,
  getAttributeValueBasedOnConfig,
} from '~/utils/attributeUtils'
import useTranslation from '~/hooks/useTranslation'

interface IShareAttributeWidgetProps {
  withContainer?: boolean
}

const AttributeWidgetContainerFAS: React.FC = ({ children }) => {
  if (!Children.count(children)) return null
  return (
    <>
      <View children={children} style={styles.attributeWidgetContainerFAS} />
      <Space />
    </>
  )
}

interface IInteractionWidgetProps {
  onAdd: () => void
  onSelect: (attrType: AttributeTypes, id: string) => void
  fields: IWidgetField[]
  name: string
  type: AttributeTypes
}

const InteractionAttributesWidget: React.FC<IInteractionWidgetProps> = ({
  onAdd,
  onSelect,
  fields,
  name,
  type,
}) => {
  const selectedCredentials = useSelector(getSelectedShareCredentials)
  const hideCreateNew = type === AttributeTypes.name && fields.length > 0
  return (
    <Widget onAdd={onAdd}>
      <Widget.Header>
        <Widget.Header.Name value={name} />
        {!hideCreateNew && <Widget.Header.Action.CreateNew />}
      </Widget.Header>
      {!fields.length ? (
        <Field.Empty />
      ) : (
        fields.map((field) => (
          <Field.Selectable
            key={field.id}
            value={field.value}
            onSelect={() => onSelect(type, field.id)}
            isSelected={
              selectedCredentials
                ? selectedCredentials[type] === field.id
                : false
            }
          />
        ))
      )}
    </Widget>
  )
}

const ShareAttributeWidget: React.FC<IShareAttributeWidgetProps> = ({
  withContainer = false,
}) => {
  const { t } = useTranslation()
  const attributes = useSelector(getRequestedAttributes)
  const selectedCredentials = useSelector(getSelectedShareCredentials)

  if (!Object.keys(attributes).length) return null

  const redirect = useRedirect()
  const { handleSelectCredential } = useCredentialShareFlow()
  const Container = withContainer ? AttributeWidgetContainerFAS : React.Fragment

  /* Preselecting first requested attribute */
  useEffect(() => {
    Object.keys(attributes).forEach((type) => {
      const t = type as AttributeTypes
      /* checking for selected credentials, otherwise, the first one is always selected */
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
                // @ts-expect-error @terms
                name={t(config.label)}
                type={attrType}
                onAdd={() =>
                  redirect(ScreenNames.CredentialForm, { type: attrType })
                }
                onSelect={(attrType, id) =>
                  handleSelectCredential({ [attrType]: id })
                }
                fields={getAttributeValueBasedOnConfig(attrType, attribute).map(
                  (value) => concatValuesShare(attrType, value),
                )}
              />
              {idx !== arr.length - 1 ? <View style={{ height: 20 }} /> : null}
            </View>
          )
        }
      })}
    </Container>
  )
}

const styles = StyleSheet.create({
  attributeWidgetContainerFAS: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.codGrey,
    borderRadius: 20,
    // Shadows
    shadowColor: Colors.black50,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 14,
    shadowOpacity: 1,
    elevation: 10,
  },
})

export default ShareAttributeWidget
