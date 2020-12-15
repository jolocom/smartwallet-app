import React from 'react'
import Form, { IFormContext } from '~/screens/LoggedIn/Identity/components/Form'
import Wizard, { IWizardFormProps, useWizard } from '.'
import Input from '../Input'
import WizardFooter from './WizardFooter'

const WizardForm: React.FC<IWizardFormProps> = ({ step, onSubmit }) => {
  const { config } = useWizard()
  const renderFields = () => (
    <Wizard.FormContainer>
      <Form.Body>
        {({ fields, updateField }) =>
          fields.map((field, idx) => (
            <Input.Block
              key={field.key}
              value={field.value}
              updateInput={(val) => updateField(field.key, val)}
              placeholder={field.label}
              autoFocus={idx === 0}
              returnKeyType={idx === fields.length - 1 ? 'done' : 'next'}
              {...field.keyboardOptions}
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
      <Form config={config[step].form}>
        {renderFields()}
        {renderFooter()}
      </Form>
    </Wizard.Body>
  )
}

export default WizardForm
