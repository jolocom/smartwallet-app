import React, { useLayoutEffect } from 'react'
import { StyleSheet, View, LayoutAnimation } from 'react-native'
import { useSelector } from 'react-redux'

import Widget from '~/components/Widget/Widget'
import Field from '~/components/Widget/Field'
import PencilIcon from '~/assets/svg/PencilIcon'
import { attributeConfig } from '~/config/claims'
import { getAttributes } from '~/modules/attributes/selectors'
import {
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

const getAttributeConfigPrimitive = (): TPrimitiveAttributesConfig => {
  return attributeConfig
}

const primitiveAttributesConfig = getAttributeConfigPrimitive()

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
      <View style={styles.credentialsContainer}>
        {sortedPrimitiveAttributes.map(({ type, label, values }) => {
          return (
            <View style={styles.group} key={type}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  credentialsContainer: {
    marginTop: BP({ default: 56, small: 38, xsmall: 38 }),
  },
  group: {
    marginBottom: 20,
  },
})

export default IdentityCredentials
