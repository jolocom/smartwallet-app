import React from 'react'
import { View } from 'react-native'
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
import { getPrimitiveAttributeById } from '~/modules/attributes/selectors'
import { useSICActions } from '~/hooks/attributes'
import { useToasts } from '~/hooks/toasts'
import { LoggedInStackParamList } from '~/screens/LoggedIn'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations'
import { AttributeI } from '~/modules/attributes/types'
import useTranslation from '~/hooks/useTranslation'

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

type TPrimitiveAttributesConfig = Omit<
  Record<AttributeTypes, IAttributeConfig>,
  AttributeTypes.businessCard
>

const getAttributeConfigPrimitive = (): TPrimitiveAttributesConfig => {
  const {
    ProofOfBusinessCardCredential,
    ...primitiveAttributesConfig
  } = attributeConfig
  return primitiveAttributesConfig
}

const primitiveAttributesConfig = getAttributeConfigPrimitive()

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
  const route = useRoute<
    RouteProp<LoggedInStackParamList, ScreenNames.CredentialForm>
  >()
  const { id: attributeId, type: attributeType } = route.params
  const { t } = useTranslation()

  const editAttribute = useSelector(
    getPrimitiveAttributeById(attributeId ?? ''),
  )

  const formConfig = mergeAttributeValuesWithConfig(
    primitiveAttributesConfig[attributeType],
    editAttribute,
  )

  const { handleCreateCredentialSI, handleEditCredentialSI } = useSICActions()
  const { scheduleWarning } = useToasts()
  const navigation = useNavigation()

  const formInitial = formConfig
    ? assembleFormInitialValues(formConfig.fields)
    : {}

  const handleCredentialSubmit = async (claims: Record<string, string>) => {
    try {
      if (attributeId) {
        await handleEditCredentialSI(
          attributeType,
          claims,
          primitiveAttributesConfig[attributeType].metadata,
          attributeId,
        )
      } else {
        await handleCreateCredentialSI(
          attributeType,
          claims,
          primitiveAttributesConfig[attributeType].metadata,
        )
      }
    } catch (e) {
      scheduleWarning({ title: 'Oops', message: 'Something went wrong!' })
    } finally {
      navigation.goBack()
    }
  }

  return (
    <Formik onSubmit={handleCredentialSubmit} initialValues={formInitial}>
      {({ handleChange, values }) => (
        <FormContainer
          title={t(
            attributeId
              ? strings.EDIT_YOUR_ATTRIBUTE
              : strings.ADD_YOUR_ATTRIBUTE,
            { attribute: formConfig.label },
          )}
          description={
            strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION
          }
          onSubmit={() => handleCredentialSubmit(values)}
        >
          <AutofocusContainer>
            {formConfig.fields.map((field, i) => {
              return (
                <AutofocusInput
                  // @ts-ignore no idea why it's complaining
                  name={field.key as string}
                  key={field.key}
                  updateInput={handleChange(field.key)}
                  value={values[field.key]}
                  placeholder={field.label}
                  autoFocus={i === 0}
                  containerStyle={{ marginBottom: 12 }}
                  {...field.keyboardOptions}
                />
              )
            })}
          </AutofocusContainer>
        </FormContainer>
      )}
    </Formik>
  )
}

export default CredentialForm
