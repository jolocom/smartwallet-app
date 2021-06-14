import React, { useState } from 'react'
import { Platform, View } from 'react-native'
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import FormContainer from '~/components/FormContainer'
import { Formik } from 'formik'
import {
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from 'react-native-formik'

import Input from '~/components/Input'
import { attributeConfig } from '~/config/claims'
import {
  AttributeTypes,
  IAttributeConfig,
  IAttributeClaimField,
  IAttributeClaimFieldWithValue,
} from '~/types/credentials'
import { assembleFormInitialValues } from '~/utils/dataMapping'
import {
  getAllValuesForType,
  getPrimitiveAttributeById,
} from '~/modules/attributes/selectors'
import { useSICActions } from '~/hooks/attributes'
import { useToasts } from '~/hooks/toasts'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations'
import { AttributeI } from '~/modules/attributes/types'
import { Colors } from '~/utils/colors'
import { FormFieldContainer, FormError } from '~/components/Form/components'
import useTranslation from '~/hooks/useTranslation'
import { MainStackParamList } from '~/screens/LoggedIn/Main'
import { trimObjectValues } from '~/utils/stringUtils'

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const mergeAttributeValuesWithConfig = (
  config: IAttributeConfig<IAttributeClaimField>,
  attribute?: AttributeI,
): IAttributeConfig<IAttributeClaimFieldWithValue> => {
  const fieldsWithValues = config.fields.map((f) => ({
    ...f,
    value: attribute && attribute.value[f.key],
  }))

  return { ...config, fields: fieldsWithValues }
}

const CredentialForm = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.CredentialForm>>()
  const { id: attributeId, type: attributeType } = route.params
  const { t } = useTranslation()

  const editAttribute = useSelector(
    getPrimitiveAttributeById(attributeId ?? ''),
  )

  const attributeValues = useSelector(getAllValuesForType(attributeType))

  const formConfig = mergeAttributeValuesWithConfig(
    attributeConfig[attributeType],
    editAttribute,
  )

  const { handleCreateCredentialSI, handleEditCredentialSI } = useSICActions()
  const { scheduleWarning } = useToasts()
  const navigation = useNavigation()

  const formInitial = formConfig
    ? assembleFormInitialValues(formConfig.fields)
    : {}

  const [allowSubmit, setAllowSubmit] = useState(false)

  const handleCredentialSubmit = async (claims: Record<string, string>) => {
    claims = trimObjectValues(claims)

    if (!allowSubmit) return

    try {
      if (attributeId) {
        await handleEditCredentialSI(
          attributeType,
          claims,
          attributeConfig[attributeType].metadata,
          attributeId,
        )
      } else {
        await handleCreateCredentialSI(
          attributeType,
          claims,
          attributeConfig[attributeType].metadata,
        )
      }
    } catch (e) {
      scheduleWarning({ title: 'Oops', message: 'Something went wrong!' })
    } finally {
      navigation.goBack()
    }
  }

  return (
    <Formik
      onSubmit={handleCredentialSubmit}
      initialValues={formInitial}
      validationSchema={formConfig.validationSchema}
    >
      {(formProps) => {
        const {
          handleChange,
          values,
          errors,
          setFieldTouched,
          setFieldError,
          touched,
          isValid,
          dirty,
        } = formProps
        const isPrevEqual = Object.keys(formInitial).every((k) => {
          if (formInitial[k] === values[k].trim()) return true
          return false
        })
        const concatValue = Object.keys(values).reduce<string>((acc, v) => {
          return acc + values[v]
        }, '')

        const storedAttribute = attributeValues?.find(
          (a) => a.value === concatValue && a.id !== attributeId,
        )
        if (storedAttribute) {
          if (!errors[Object.keys(values)[0]]) {
            setFieldError(
              Object.keys(values)[0],
              strings.ERROR_ATTRIBUTE_ALREADY_EXISTS,
            )
          }
        }

        const shouldDisableSubmit = !isValid || !dirty || isPrevEqual
        setAllowSubmit(!shouldDisableSubmit)

        return (
          <FormContainer
            title={t(
              attributeId
                ? strings.EDIT_YOUR_ATTRIBUTE
                : strings.ADD_YOUR_ATTRIBUTE,
              { attribute: formConfig.label.toLowerCase() },
            )}
            description={t(
              strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION,
            )}
            onSubmit={() => handleCredentialSubmit(values)}
            isSubmitDisabled={shouldDisableSubmit}
          >
            <AutofocusContainer
              style={{
                // NOTE: allow scrolling if there are too many fields
                paddingBottom:
                  formConfig.fields.length > 3
                    ? Platform.select({ ios: 200, android: 0 })
                    : 0,
              }}
            >
              {formConfig.fields.map((field, i) => {
                return (
                  <FormFieldContainer key={field.key}>
                    <AutofocusInput
                      testID="credential-form-input"
                      // @ts-expect-error
                      name={field.key as string}
                      key={field.key}
                      updateInput={handleChange(field.key)}
                      value={values[field.key]}
                      placeholder={field.label}
                      autoFocus={i === 0}
                      onBlur={() => setFieldTouched(field.key, true, false)}
                      /* we want to show highlighted focused input only if
                        - there are no errors
                        - value is truthy
                      */
                      withHighlight={
                        !Boolean(errors[field.key]) &&
                        Boolean(values[field.key])
                      }
                      /* NOTE: all these conditions is an ugly workaround when errors are displayed in postal address.
                         We need to check if a field was touched and only then show an error,
                         otherwise all the errors appear at once if one field is incorrect
                      */
                      containerStyle={{
                        borderColor: Colors.gravel,
                        backgroundColor: Colors.bastille,
                        ...(((attributeType === AttributeTypes.postalAddress &&
                          touched[field.key]) ||
                          attributeType !== AttributeTypes.postalAddress) &&
                          errors[field.key] && {
                            borderColor: Colors.error,
                          }),
                      }}
                      {...field.keyboardOptions}
                    />
                    {(attributeType === AttributeTypes.postalAddress &&
                      touched[field.key]) ||
                    attributeType !== AttributeTypes.postalAddress ? (
                      <FormError message={errors[field.key]} />
                    ) : null}
                  </FormFieldContainer>
                )
              })}
            </AutofocusContainer>
          </FormContainer>
        )
      }}
    </Formik>
  )
}

export default CredentialForm
