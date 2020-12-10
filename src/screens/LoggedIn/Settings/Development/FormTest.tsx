import React from 'react'
import { KeyboardTypeOptions } from 'react-native'
import Btn from '~/components/Btn'

import Input from '~/components/Input'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import ScreenContainer from '~/components/ScreenContainer'
import Form, { IFormContext } from '../../Identity/components/Form'
import Section from '../components/Section'

const nameConfig = {
  id: 'name',
  fields: [
    {
      id: 'givenName',
      placeholder: 'Select a given name',
      keyboardType: 'default' as KeyboardTypeOptions,
    },
    {
      id: 'lastName',
      placeholder: 'Select a last name',
      keyboardType: 'default' as KeyboardTypeOptions,
    },
  ],
}

const FormTest = () => {
  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloKeyboardAwareScroll
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
      >
        <Section title="With header" hasBlock={false}>
          <Form config={nameConfig}>
            <Form.Header>
              <Form.Header.Cancel />
              <Form.Header.Done />
            </Form.Header>
            <Form.Body>
              {({
                fields,
                updateField,
              }: Pick<IFormContext, 'fields' | 'updateField'>) =>
                fields.map((field) => (
                  <Input.Block
                    key={field.id}
                    updateInput={(val: string) => updateField(field.id, val)}
                    value={field.value}
                    placeholder={field.placeholder}
                    keyboardType={field.keyboardType}
                  />
                ))
              }
            </Form.Body>
          </Form>
        </Section>
        <Section title="Without header" hasBlock={false}>
          <Form config={nameConfig}>
            <Form.Body>
              {({
                fields,
                updateField,
              }: Pick<IFormContext, 'fields' | 'updateField'>) =>
                fields.map((field) => (
                  <Input.Underline
                    key={field.id}
                    value={field.value}
                    updateInput={(val) => updateField(field.id, val)}
                    placeholder={field.placeholder}
                    keyboardType={field.keyboardType}
                  />
                ))
              }
            </Form.Body>
          </Form>
        </Section>
        <Section title="Exposed values in form" hasBlock={false}>
          <Form config={nameConfig}>
            <Form.Body>
              {({ fields, updateField }: IFormContext) =>
                fields.map((field) => (
                  <Input.Block
                    key={field.id}
                    value={field.value}
                    updateInput={(val) => updateField(field.id, val)}
                  />
                ))
              }
            </Form.Body>
            <Form.Expose>
              {({ onSubmit }: IFormContext) => (
                <Btn onPress={onSubmit}>Get form values</Btn>
              )}
            </Form.Expose>
          </Form>
        </Section>
      </JoloKeyboardAwareScroll>
    </ScreenContainer>
  )
}

export default FormTest
