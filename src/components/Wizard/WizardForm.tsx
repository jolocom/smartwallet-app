import React from 'react'
import { View } from 'react-native'
import { Formik } from 'formik'
import {
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from 'react-native-formik'

import { Colors } from '~/utils/colors'
import { IWizardFormProps } from './types'
import { useWizard } from './context'
import Input from '../Input'
import { assembleFormInitialValues } from '~/utils/dataMapping'
import JoloText from '../JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import WizardBody from './WizardBody'
import WizardFooter from './WizardFooter'
import useTranslation from '~/hooks/useTranslation'

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const WizardForm: React.FC<IWizardFormProps> = ({ step, onSubmit }) => {
  const { t } = useTranslation()
  const { config, setActiveStep, isLastStep } = useWizard()
  const { form: formConfig, validationSchema } = config[step]
  const initialValues = assembleFormInitialValues(formConfig.fields)

  const handleFormSubmit = async (fields: Record<string, string>) => {
    await onSubmit(fields)
    if (!isLastStep) setActiveStep((prevState) => prevState + 1)
  }

  return (
    <WizardBody step={step}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, values, isValid, errors, dirty }) => (
          <>
            <AutofocusContainer
              style={{
                marginTop: 36,
                marginBottom: 8,
              }}
            >
              {formConfig.fields.map((field, idx) => (
                <View style={{ marginBottom: 10 }} key={field.key}>
                  <AutofocusInput
                    testID="wizard-input"
                    // @ts-ignore
                    name={field.key}
                    key={field.key}
                    // @ts-ignore
                    value={values[field.key]}
                    updateInput={(v) => setFieldValue(field.key, v.trimLeft())}
                    // @ts-expect-error terms
                    placeholder={t(field.label)}
                    autoFocus={idx === 0}
                    withHighlight={
                      !errors[field.key] && Boolean(values[field.key])
                    }
                    placeholderTextColor={Colors.white30}
                    // TODO: remove if not used here
                    // onBlur={() => setFieldTouched(field.key, true, false)}
                    containerStyle={
                      errors[field.key] ? { borderColor: Colors.error } : {}
                    }
                    {...field.keyboardOptions}
                  />
                  {errors[field.key] && (
                    <JoloText size={JoloTextSizes.mini} color={Colors.error}>
                      {/* @ts-expect-error terms */}
                      {t(errors[field.key])}
                    </JoloText>
                  )}
                </View>
              ))}
            </AutofocusContainer>
            <WizardFooter
              onSubmit={() => handleFormSubmit(values)}
              isDisabled={!dirty || (dirty && !isValid)}
            />
          </>
        )}
      </Formik>
    </WizardBody>
  )
}

export default WizardForm
