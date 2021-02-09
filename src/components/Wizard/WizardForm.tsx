import React from 'react'
import { View } from 'react-native'
import { Formik } from 'formik'
import { withNextInputAutoFocusInput, withNextInputAutoFocusForm } from 'react-native-formik'
import * as yup from 'yup';
import { Colors } from '~/utils/colors'
import Wizard, { IWizardFormProps, useWizard } from '.'
import Input from '../Input'
import { assembleFormInitialValues } from '~/utils/dataMapping'
import JoloText from '../JoloText';
import { JoloTextSizes } from '~/utils/fonts';

// TODO: remove it: used only for a reference
// yup.addMethod(yup.object, 'atLeastOneOf', function(list) {
//   return this.test({
//     name: 'atLeastOneOf',
//     message: '${path} must have at least one of these keys: ${keys}',
//     exclusive: true,
//     params: { keys: list.join(', ') },
//     test: value => value == null || list.some(f => !!value[f])
//   })
// })

yup.addMethod(yup.object, 'atLeastOne', function (list, message) {
  return this.test({
    message,
    test: function (value) {
      const { familyName } = this.parent;
      if (!familyName) return !!value
      return true
    } 
  })
})


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
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={yup.object().shape({
          givenName: yup.string().test({
            message: 'Please provide at least one of the values', test: function (value) {
              const { familyName } = this.parent;
              if (!familyName) return !!value
              return true
            }
          }),
          familyName: yup.string()
        })}
      >
        {({ handleChange, handleSubmit, values, isValid, errors, setFieldTouched }) => {
          console.log({isValid});
          console.log({errors});
          return (
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
            <Wizard.Footer onSubmit={handleSubmit} isDisabled={!isValid} />
          </>
        )}}
      </Formik>
    </Wizard.Body>
  )
}

export default WizardForm
