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
import useTranslation from '~/hooks/useTranslation'
import {
  concatValuesIdentity,
  getAttributeValueBasedOnConfig,
} from '~/utils/attributeUtils'

const getAttributeConfigPrimitive = (): TPrimitiveAttributesConfig => {
  return attributeConfig
}

const primitiveAttributesConfig = getAttributeConfigPrimitive()

const IdentityCredentials = () => {
  const { t } = useTranslation()
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
          const concatValues = getAttributeValueBasedOnConfig(type, values).map(
            (value) => concatValuesIdentity(type, value),
          )
          const hideCreateNew =
            type === AttributeTypes.name && concatValues.length > 0
          return (
            <View style={styles.group} key={type}>
              <Widget
                onAdd={() => redirect(ScreenNames.CredentialForm, { type })}
              >
                <Widget.Header>
                  {/* @ts-ignore FIXME terms */}
                  <Widget.Header.Name value={t(label) as string} />
                  {!hideCreateNew && <Widget.Header.Action.CreateNew />}
                </Widget.Header>
                {concatValues.length ? (
                  concatValues.map((field) => (
                    <IdentityField
                      key={field.id}
                      id={field.id}
                      type={type}
                      value={field.value as string}
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
