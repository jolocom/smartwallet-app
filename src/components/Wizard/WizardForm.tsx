import React from 'react'
import Form, { IFormContext } from '~/screens/LoggedIn/Identity/components/Form'
import Wizard, { IWizardFormProps } from '.'
import Input from '../Input'
import WizardFooter from './WizardFooter'

const WizardForm: React.FC<IWizardFormProps> = ({ config, step, onSubmit }) => {
  const renderFields = () => (
    <Wizard.FormContainer>
      <Form.Body>
        {({ fields, updateField }) =>
          fields.map((field, idx) => (
            <Input.Block
              {...field}
              autoFocus={idx === 0}
              placeholder={field.label}
              updateInput={(val) => updateField(field.key, val)}
            />
          ))
        }
      </Form.Body>
    </Wizard.FormContainer>
  )

  const renderFooter = () => (
    <Form.Expose>
      {({ fields }: IFormContext) => (
        <WizardFooter onSubmit={() => onSubmit(fields)} />
      )}
    </Form.Expose>
  )

  return (
    <Wizard.Body step={step}>
      <Form config={config}>
        {renderFields()}
        {renderFooter()}
      </Form>
    </Wizard.Body>
  )
}

export default WizardForm
