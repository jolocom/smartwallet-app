import React, { useLayoutEffect } from 'react'
import { StyleSheet, View, LayoutAnimation } from 'react-native'
import { useSelector } from 'react-redux'

import Widget from '~/components/Widget/Widget'
import Field from '~/components/Widget/Field'
import PencilIcon from '~/assets/svg/PencilIcon'
import { attributeConfig } from '~/config/claims'
import { getAttributes } from '~/modules/attributes/selectors'
import {
  AttributeTypes,
  IAttributeConfig,
  PrimitiveAttributeTypes,
  TPrimitiveAttributesConfig,
} from '~/types/credentials'

import IdentityTabs from './tabs'
import { strings } from '~/translations'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import IdentityField from './IdentityField'
import { useSICActions } from '~/hooks/attributes'
import BP from '~/utils/breakpoints'
import { ClaimValues } from '~/modules/attributes/types'

const getAttributeConfigPrimitive = (): TPrimitiveAttributesConfig => {
  return attributeConfig
}

const primitiveAttributesConfig = getAttributeConfigPrimitive()

const getFormattedValue = (value: ClaimValues, type: AttributeTypes) => {
  /**
   * NOTE: this is to allocate 4 lines for address attribute type
   */
  switch (type) {
    case AttributeTypes.postalAddress:
      return Object.values(value).map((v) => (v ? v.toString() : ''))
    default:
      return Object.values(value).join(' ')
  }
}

const IdentityCredentials = () => {
  const redirect = useRedirect()
  const attributes = useSelector(getAttributes)
  const { handleDeleteCredentialSI } = useSICActions()

  useLayoutEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 300,
    })
  }, [JSON.stringify(attributes)])

  const primitiveAttributesWithValues = Object.entries<IAttributeConfig>(
    primitiveAttributesConfig,
  ).map(([type, config]) => {
    return {
      type: type as PrimitiveAttributeTypes,
      label: config.label,
      values: attributes[type as PrimitiveAttributeTypes] ?? [],
    }
  })

  const isPrimitiveAttributesEmpty = primitiveAttributesWithValues.every(
    (a) => !a.values.length,
  )

  return (
    <View testID="identity-credentials-present" style={styles.container}>
      <IdentityTabs.Styled.Placeholder show={isPrimitiveAttributesEmpty}>
        {strings.YOUR_INFO_IS_QUITE_EMPTY}
      </IdentityTabs.Styled.Placeholder>
      <View style={styles.credentialsContainer}>
        {primitiveAttributesWithValues.map(({ type, label, values }) => {
          const hideCreateNew =
            type === AttributeTypes.name && values.length > 0
          return (
            <View style={styles.group} key={type}>
              <Widget
                onAdd={() => redirect(ScreenNames.CredentialForm, { type })}
              >
                <Widget.Header>
                  <Widget.Header.Name value={label} />
                  {!hideCreateNew && <Widget.Header.Action.CreateNew />}
                </Widget.Header>
                {values.length ? (
                  values.map((field) => (
                    <IdentityField
                      key={field.id}
                      id={field.id}
                      type={type}
                      value={getFormattedValue(field.value, type)}
                      onDelete={() => handleDeleteCredentialSI(field.id, type)}
                    />
                  ))
                ) : (
                  <Field.Empty>
                    <PencilIcon />
                  </Field.Empty>
                )}
              </Widget>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  credentialsContainer: {
    marginTop: BP({ default: 32 }),
  },
  group: {
    marginBottom: 20,
  },
})

export default IdentityCredentials