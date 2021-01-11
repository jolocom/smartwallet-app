import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'
import React, { useState } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import PencilIcon from '~/assets/svg/PencilIcon'
import Input from '~/components/Input'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import Widget from '~/components/Widget'
import Field from '~/components/Widget/Field'
import { attributeConfig } from '~/config/claims'
import { getAttributes } from '~/modules/attributes/selectors'
import {
  AttributeTypes,
  ClaimKeys,
  IAttributeConfig,
} from '~/types/credentials'
import Form from './components/Form'

const IdentityCredentials = () => {
  const attributes = useSelector(getAttributes)

  const [expandedForm, setExpandedForm] = useState<AttributeTypes | null>(null)
  const toggleForm = (cb: (type?: AttributeTypes) => void) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
    cb()
  }

  const [formConfig, setFormConfig] = useState<IAttributeConfig | null>(null)

  const handleShowNewForm = (type: AttributeTypes) => {
    toggleForm(() => setExpandedForm(type))
    setFormConfig(attributeConfig[type])
  }

  const handleShowEditForm = (
    type: AttributeTypes,
    values: Record<ClaimKeys, ClaimEntry>,
  ) => {
    const fieldsWithValues = attributeConfig[type].fields.map((f) => ({
      ...f,
      value: values[f.key],
    }))

    toggleForm(() => setExpandedForm(type))
    setFormConfig({
      ...attributeConfig[type],
      fields: fieldsWithValues,
    })
  }

  const handleHideForm = () => toggleForm(() => setExpandedForm(null))

  return (
    <View testID="identity-credentials-present" style={styles.container}>
      <JoloKeyboardAwareScroll
        showsVerticalScrollIndicator={false}
        /* TODO: double check if these props are actually needed */
        overScrollMode="never"
        enableOnAndroid
      >
        {Object.entries(attributeConfig).map(([aKey, aVal]) => (
          <View style={styles.group}>
            <Widget onCreate={() => handleShowNewForm(aKey)}>
              <Widget.Header>
                <Widget.Header.Name value={aVal.label} />
                {attributes[aKey] && <Widget.Header.Action.CreateNew />}
              </Widget.Header>
              {attributes[aKey] ? (
                attributes[aKey].map((f) => (
                  <TouchableOpacity
                    onPress={() => handleShowEditForm(aKey, f.value)}
                    key={f.id}
                  >
                    <Field.Static
                      key={f.key}
                      value={Object.values(f.value).join(' ')}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Field.Empty>
                  {/* TODO: rething how to pass field placeholder value */}
                  <PencilIcon />
                </Field.Empty>
              )}
            </Widget>
            {aKey === expandedForm && formConfig && (
              <Form config={formConfig} onCancel={handleHideForm}>
                <Form.Header>
                  <Form.Header.Cancel />
                  <Form.Header.Done />
                </Form.Header>
                <Form.Body>
                  {({ fields, updateField }) =>
                    fields.map((field, idx) => (
                      <Input.Block
                        updateInput={(val: string) =>
                          updateField(field.key, val)
                        }
                        value={field.value}
                        placeholder={field.label}
                        {...field.keyboardOptions}
                        autoFocus={idx === 0}
                      />
                    ))
                  }
                </Form.Body>
              </Form>
            )}
          </View>
        ))}
      </JoloKeyboardAwareScroll>
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
