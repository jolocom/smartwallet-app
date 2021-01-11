import React, { useState } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import PencilIcon from '~/assets/svg/PencilIcon'
import Input from '~/components/Input'
import Widget from '~/components/Widget'
import Field from '~/components/Widget/Field'
import { attributeConfig } from '~/config/claims'
import { getAttributes } from '~/modules/attributes/selectors'
import { AttributeTypes } from '~/types/credentials'
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

  const handleShowForm = (type: AttributeTypes) =>
    toggleForm(() => setExpandedForm(type))
  const handleHideForm = () => toggleForm(() => setExpandedForm(null))

  return (
    <View testID="identity-credentials-present" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(attributeConfig).map(([aKey, aVal]) => (
          <>
            <Widget onCreate={() => handleShowForm(aKey)}>
              <Widget.Header>
                <Widget.Header.Name value={aVal.label} />
                {attributes[aKey] && <Widget.Header.Action.CreateNew />}
              </Widget.Header>
              {attributes[aKey] ? (
                attributes[aKey].map((f) => (
                  <TouchableOpacity onPress={() => handleShowForm(aKey)}>
                    <Field.Static
                      key={f.key}
                      value={Object.values(f.value).join(' ')}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Field.Empty>
                  <PencilIcon />
                </Field.Empty>
              )}
            </Widget>
            {aKey === expandedForm && (
              <Form config={attributeConfig[aKey]} onCancel={handleHideForm}>
                <Form.Header>
                  <Form.Header.Cancel />
                  <Form.Header.Done />
                </Form.Header>
                <Form.Body>
                  {({ fields, updateField }) =>
                    fields.map((field) => (
                      <Input.Block
                        key={field.key}
                        updateInput={(val: string) =>
                          updateField(field.key, val)
                        }
                        value={field.value}
                        placeholder={field.label}
                        {...field.keyboardOptions}
                      />
                    ))
                  }
                </Form.Body>
              </Form>
            )}
          </>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})

export default IdentityCredentials
