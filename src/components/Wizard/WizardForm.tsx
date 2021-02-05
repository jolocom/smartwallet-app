import React from 'react'
import { View } from 'react-native'
import { Formik } from 'formik'
import { withNextInputAutoFocusInput } from 'react-native-formik'
import { withNextInputAutoFocusForm } from 'react-native-formik'
import { Colors } from '~/utils/colors'
import Wizard, { IWizardFormProps, useWizard } from '.'
import Input from '../Input'
import { assembleFormInitialValues } from '~/utils/dataMapping'

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const WizardForm: React.FC<IWizardFormProps> = ({ step, onSubmit }) => {
  const { config, setActiveStep, isLastStep } = useWizard()
  const formConfig = config[step].form
  const initialValues = assembleFormInitialValues(formConfig.fields)

  const handleFormSubmit = (fields: Record<string, string>) => {
    onSubmit(fields)
    if (!isLastStep) setActiveStep((prevState) => prevState + 1)
  }

  return (
    <Wizard.Body step={step}>
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
        {({ handleChange, handleSubmit, values }) => (
          <>
            <AutofocusContainer
              style={{
                marginTop: 35,
                marginBottom: 8,
              }}
            >
              {formConfig.fields.map((field, idx) => (
                <AutofocusInput
                  // @ts-ignore
                  name={field.key}
                  key={field.key}
                  // @ts-ignore
                  value={values[field.key]}
                  updateInput={handleChange(field.key)}
                  placeholder={field.label}
                  autoFocus={idx === 0}
                  containerStyle={{ marginBottom: 10 }}
                  placeholderTextColor={Colors.white30}
                  {...field.keyboardOptions}
                />
              ))}
            </AutofocusContainer>
            <Wizard.Footer onSubmit={handleSubmit} />
          </>
        )}
      </Formik>
    </Wizard.Body>
  )
}

export default WizardForm
