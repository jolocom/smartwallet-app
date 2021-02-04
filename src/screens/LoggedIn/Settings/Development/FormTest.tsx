import React from 'react'
import Btn from '~/components/Btn'

import Input from '~/components/Input'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import ScreenContainer from '~/components/ScreenContainer'
import { attributeConfig } from '~/config/claims'
import { AttributeTypes } from '~/types/credentials'
import Form, { IFormContext } from '~/components/Form'
import Section from '../components/Section'

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
        <Section>
          <Section.Title>With header</Section.Title>
          <Form config={attributeConfig[AttributeTypes.name]}>
            <Form.Header>
              <Form.Header.Cancel />
              <Form.Header.Done />
            </Form.Header>
            <Form.Body>
              {({ fields, updateField }) =>
                fields.map((field) => (
                  <Input.Block
                    key={field.key}
                    updateInput={(val: string) => updateField(field.key, val)}
                    value={field.value}
                    placeholder={field.label}
                    {...field.keyboardOptions}
                  />
                ))
              }
            </Form.Body>
          </Form>
        </Section>
        <Section>
          <Section.Title>Without header</Section.Title>
          <Form config={attributeConfig[AttributeTypes.postalAddress]}>
            <Form.Body>
              {({ fields, updateField }) =>
                fields.map((field) => (
                  <Input.Underline
                    key={field.key}
                    value={field.value}
                    updateInput={(val) => updateField(field.key, val)}
                    placeholder={field.label}
                    {...field.keyboardOptions}
                  />
                ))
              }
            </Form.Body>
          </Form>
        </Section>
        <Section>
          <Section.Title>Exposed values in form</Section.Title>
          <Form config={attributeConfig[AttributeTypes.emailAddress]}>
            <Form.Body>
              {({ fields, updateField }) =>
                fields.map((field) => (
                  <Input.Block
                    key={field.key}
                    value={field.value}
                    updateInput={(val) => updateField(field.key, val)}
                    placeholder={field.label}
                    {...field.keyboardOptions}
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
