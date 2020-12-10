import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import Input from '~/components/Input'
import ScreenContainer from '~/components/ScreenContainer'
import Widget from '~/components/Widget'
import { getAttributes } from '~/modules/attributes/selectors'
import Form, { IFormContext } from './components/Form'
import FormField from './components/FormField'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  return (
    <ScreenContainer>
      {/* <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
            >
            {Object.keys(attributes).map((attrKey) => (
            <Widget>
            <Widget.Header.Name value={attrKey} />
            {attributes[attrKey].map((field) => (
            <Widget.Field.Static value={field.value} />
            ))}
            <Widget>
            <Widget.Header.Name value="companyName" />
            <Widget.Field.Static value="Jolocom" />
            </Widget>
            </Widget>
            ))}
            <Form
            config={{
            id: 'name',
            fields: [
            {
            id: 'givenName',
            placeholder: 'Select a given name',
            keyboardType: 'default',
            },
            {
            id: 'lastName',
            placeholder: 'Select a last name',
            keyboardType: 'default',
            },
            ],
            }}
            onCancel={() => {}}
            onSubmit={() => {}}
            >
            <Form.Header>
            <Form.Header.Cancel />
            <Form.Header.Done />
            </Form.Header>
            <Form.Body>
            {({ fields, updateField }) =>
            fields.map((field) => (
            <FormField
            key={field.id}
            updateValue={(val: string) => updateField(field.id, val)}
            value={field.value}
            />
            ))
            }
            </Form.Body>
            </Form>
            </ScrollView> */}
    </ScreenContainer>
  )
}

export default Identity
