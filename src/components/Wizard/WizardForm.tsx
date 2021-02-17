import React from 'react'
import { View } from 'react-native'
import { Formik } from 'formik'
import { withNextInputAutoFocusInput, withNextInputAutoFocusForm } from 'react-native-formik'
import { Colors } from '~/utils/colors'
import Wizard, { IWizardFormProps, useWizard } from '.'
import Input from '../Input'
import { assembleFormInitialValues } from '~/utils/dataMapping'
import JoloText from '../JoloText';
import { JoloTextSizes } from '~/utils/fonts';

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const WizardForm: React.FC<IWizardFormProps> = ({ step, onSubmit }) => {
  const { config, setActiveStep, isLastStep } = useWizard()
  const {form: formConfig, validationSchema} = config[step]
  const initialValues = assembleFormInitialValues(formConfig.fields)

  const handleFormSubmit = (fields: Record<string, string>) => {
    onSubmit(fields)
    if (!isLastStep) setActiveStep((prevState) => prevState + 1)
  }

  return (
    <Wizard.Body step={step}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, values, isValid, errors, dirty }) => (
          <>
            <AutofocusContainer
              style={{
                marginTop: 35,
                marginBottom: 8,
              }}
            >
              {formConfig.fields.map((field, idx) => (
                <View style={{ marginBottom: 10 }}>
                  <AutofocusInput
                    // @ts-ignore
                    name={field.key}
                    key={field.key}
                    // @ts-ignore
                    value={values[field.key]}
                    updateInput={handleChange(field.key)}
                    placeholder={field.label}
                    autoFocus={idx === 0}
                    placeholderTextColor={Colors.white30}
                    // TODO: remove if not used here 
                    // onBlur={() => setFieldTouched(field.key, true, false)}
                    containerStyle={errors[field.key] ? { borderColor: Colors.error } : {}}
                    {...field.keyboardOptions}
                  />
                  {errors[field.key] && (
                    <JoloText size={JoloTextSizes.mini} color={Colors.error}>
                      {errors[field.key]}
                    </JoloText>
                  )}
                </View>
              ))}
            </AutofocusContainer>
              <Wizard.Footer onSubmit={handleSubmit} isDisabled={!dirty || (dirty && !isValid) } />
          </>
        )}
      </Formik>
    </Wizard.Body>
  )
}

export default WizardForm
