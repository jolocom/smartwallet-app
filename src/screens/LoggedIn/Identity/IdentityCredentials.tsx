import React, { useEffect, useLayoutEffect } from 'react'
import { StyleSheet, View, LayoutAnimation } from 'react-native'
import { useSelector } from 'react-redux'

import Widget from '~/components/Widget/Widget'
import Field from '~/components/Widget/Field'
import PencilIcon from '~/assets/svg/PencilIcon'
import { attributeConfig } from '~/config/claims'
import { getPrimitiveAttributes } from '~/modules/attributes/selectors'
import { AttributeTypes, IAttributeConfig } from '~/types/credentials'

import IdentityTabs from './tabs'
import { strings } from '~/translations'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import IdentityField from './IdentityField'
import { useSICActions } from '~/hooks/attributes'

type TPrimitiveAttributeTypes = Exclude<
  AttributeTypes,
  AttributeTypes.businessCard
>
type TPrimitiveAttributesConfig = Omit<
  Record<AttributeTypes, IAttributeConfig>,
  AttributeTypes.businessCard
>

const getAttributeConfigPrimitive = (): TPrimitiveAttributesConfig => {
  const {
    ProofOfBusinessCardCredential,
    ...primitiveAttributesConfig
  } = attributeConfig
  return primitiveAttributesConfig
}

const primitiveAttributesConfig = getAttributeConfigPrimitive()

const IdentityCredentials = () => {
  const redirect = useRedirect()
  const attributes = useSelector(getPrimitiveAttributes)
  const { handleDeleteCredentialSI } = useSICActions()

  useLayoutEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 300,
    })
  }, [attributes])

  const primitiveAttributesWithValues = Object.entries<IAttributeConfig>(
    primitiveAttributesConfig,
  ).map(([type, config]) => {
    return {
      type: type as TPrimitiveAttributeTypes,
      label: config.label,
      values: attributes[type as TPrimitiveAttributeTypes] ?? [],
    }
  })

  const sortedPrimitiveAttributes = primitiveAttributesWithValues.sort(
    (a, b) => {
      const aValues = !!a.values.length
      const bValues = !!b.values.length
      if ((!aValues && !bValues) || (aValues && bValues)) return 0
      else if (aValues && !bValues) return -1
      else return 1
    },
  )

  const isPrimitiveAttributesEmpty = primitiveAttributesWithValues.every(
    (a) => !a.values.length,
  )

  return (
    <View testID="identity-credentials-present" style={styles.container}>
      <IdentityTabs.Styled.Placeholder show={isPrimitiveAttributesEmpty}>
        {strings.YOUR_INFO_IS_QUITE_EMPTY}
      </IdentityTabs.Styled.Placeholder>
      {sortedPrimitiveAttributes.map(({ type, label, values }, i) => {
        return (
          <View style={styles.group} key={i}>
            <Widget
              onAdd={() => redirect(ScreenNames.CredentialForm, { type })}
            >
              <Widget.Header>
                <Widget.Header.Name value={label} />
                <Widget.Header.Action.CreateNew />
              </Widget.Header>
              {values.length ? (
                values.map((field) => (
                  <IdentityField
                    key={field.id}
                    id={field.id}
                    type={type}
                    value={Object.values(field.value).join(' ')}
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
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  group: {
    marginBottom: 20,
  },
})

export default IdentityCredentials
