import React from 'react'
import Input from '~/components/Input'
import ScreenContainer from '~/components/ScreenContainer'
import Form, { IFormContext } from '../../Identity/components/Form'

const FormTest = () => {
  return (
    <ScreenContainer>
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
          {({
            fields,
            updateField,
          }: Pick<IFormContext, 'fields' | 'updateField'>) =>
            fields.map((field) => (
              <Input.Block
                key={field.id}
                updateInput={(val: string) => updateField(field.id, val)}
                value={field.value}
              />
            ))
          }
        </Form.Body>
      </Form>
    </ScreenContainer>
  )
}

export default FormTest
