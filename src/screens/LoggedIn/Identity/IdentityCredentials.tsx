import React, { useEffect, useState } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import { Formik } from 'formik'
import {
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik'

import Input from '~/components/Input'
import Widget from '~/components/Widget/Widget'
import Field from '~/components/Widget/Field'
import PencilIcon from '~/assets/svg/PencilIcon'
import { attributeConfig } from '~/config/claims'
import { getPrimitiveAttributes } from '~/modules/attributes/selectors'
import {
  AttributeTypes,
  IAttributeClaimField,
  IAttributeClaimFieldWithValue,
  IAttributeConfig,
} from '~/types/credentials'
import { useSICActions } from '~/hooks/attributes'

import { useToasts } from '~/hooks/toasts'
import FormHeader from '~/components/FormHeader'
import { assembleFormInitialValues } from '~/utils/dataMapping'
import IdentityTabs from './tabs'
import { strings } from '~/translations'

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

enum FormModes {
  add = 'add',
  edit = 'edit',
  none = 'none',
}

type TPrimitiveAttributeTypes = Exclude<
  AttributeTypes,
  AttributeTypes.businessCard
>
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

const IdentityCredentials = () => {
  const [expandedForm, setExpandedForm] = useState<
    TPrimitiveAttributeTypes | undefined
  >(undefined)
  const [formMode, setFormMode] = useState(FormModes.none)
  const [formConfig, setFormConfig] = useState<IAttributeConfig<
    IAttributeClaimFieldWithValue | IAttributeClaimField
  > | null>(null)
  const [editClaimId, setEditClaimId] = useState<string | undefined>(undefined) // state that shows what claim are we editing

  const attributes = useSelector(getPrimitiveAttributes)
  const { handleCreateCredentialSI, handleEditCredentialSI } = useSICActions()
  const { scheduleWarning } = useToasts()

  // we are not interested in claim id in 'add' mode, therefore resetting value to avoid confusions
  useEffect(() => {
    if (formMode === FormModes.add) {
      setEditClaimId(undefined)
    }
  }, [formMode])

  useEffect(() => {
    if (!expandedForm) {
      setFormMode(FormModes.none)
      setFormConfig(null)
      setEditClaimId(undefined)
    }
  }, [expandedForm])

  // update form config
  useEffect(() => {
    if (formMode === FormModes.add && expandedForm) {
      setFormConfig(primitiveAttributesConfig[expandedForm])
    } else if (formMode === FormModes.edit && expandedForm && editClaimId) {
      // NOTE: in edit more form should be aware of claim values
      const fieldsWithValues = attributeConfig[expandedForm].fields.map(
        (f) => ({
          ...f,
          value: attributes[expandedForm]?.find((a) => a.id === editClaimId)
            ?.value[f.key],
        }),
      )
      setFormConfig({
        ...primitiveAttributesConfig[expandedForm],
        fields: fieldsWithValues,
      })
    }
  }, [formMode, expandedForm, editClaimId])

  const toggleForm = (cb: (type?: TPrimitiveAttributeTypes) => void) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
    cb()
  }

  const handleShowForm = (mode: FormModes) => {
    return (type: TPrimitiveAttributeTypes, id?: string) => {
      setFormMode(mode)
      toggleForm(() => setExpandedForm(type))
      if (id) {
        setEditClaimId(id)
      }
    }
  }
  const handleShowNewForm = handleShowForm(FormModes.add)
  const handleShowEditForm = handleShowForm(FormModes.edit)

  const handleHideForm = () => toggleForm(() => setExpandedForm(undefined))

  const handleCredentialCreate = async (claims: Record<string, string>) => {
    if (expandedForm) {
      try {
        await handleCreateCredentialSI(
          expandedForm,
          claims,
          primitiveAttributesConfig[expandedForm].metadata,
        )
        setExpandedForm(undefined)
      } catch (e) {
        scheduleWarning({
          title: 'Error adding',
          message: 'Failed to create Self Issued Credential',
        })
      }
    }
  }

  const handleCredentialEdit = async (claims: Record<string, string>) => {
    if (expandedForm && editClaimId) {
      try {
        await handleEditCredentialSI(
          expandedForm,
          claims,
          primitiveAttributesConfig[expandedForm].metadata,
          editClaimId,
        )
        setExpandedForm(undefined)
      } catch (err) {
        scheduleWarning({
          title: 'Error editing',
          message: `Failed to edit Self Issued Credential ${editClaimId}`,
        })
      }
    }
  }

  const handleCredentialSubmit = (values: Record<string, string>) => {
    if (formMode === FormModes.add) {
      handleCredentialCreate(values)
    } else if (formMode === FormModes.edit) {
      handleCredentialEdit(values)
    }
  }

  const getIsWidgetShown = (type: AttributeTypes) => {
    if (type === expandedForm) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })
      if (formMode === FormModes.edit) {
        return expandedForm && Boolean(attributes[type]?.length > 1)
      } else if (formMode === FormModes.add) {
        return expandedForm && Boolean(attributes[type]?.length)
      } else {
        return true
      }
    }
    return true
  }

  const formInitial = formConfig
    ? assembleFormInitialValues(formConfig.fields)
    : {}

  const primitiveAttributesWithValues = Object.entries<IAttributeConfig>(
    primitiveAttributesConfig,
  ).map(([key, config]) => {
    return {
      key: key as TPrimitiveAttributeTypes,
      config,
      values: attributes[key as TPrimitiveAttributeTypes] ?? [],
    }
  })

  const sortedPrimitiveAttributes = primitiveAttributesWithValues.sort(
    (a, b) => {
      const aValues = !!a.values.length
      const bValues = !!b.values.length
      if ((!aValues && !bValues) || (aValues && bValues)) return 0
      else if (aValues && !bValues) return -1
      else return 1
    },
  )

  const isPrimitiveAttributesEmpty = primitiveAttributesWithValues.every(
    (a) => !a.values.length,
  )

  return (
    <View testID="identity-credentials-present" style={styles.container}>
      <IdentityTabs.Styled.Placeholder show={isPrimitiveAttributesEmpty}>
        {strings.YOUR_INFO_IS_QUITE_EMPTY}
      </IdentityTabs.Styled.Placeholder>
      {sortedPrimitiveAttributes.map(({ key, config, values }) => {
        return (
          <View style={styles.group} key={key}>
            {getIsWidgetShown(key) ? (
              <Widget onAdd={() => handleShowNewForm(key)}>
                <Widget.Header>
                  <Widget.Header.Name value={config.label} />
                  <Widget.Header.Action.CreateNew />
                </Widget.Header>
                {values.length ? (
                  values.map((field) => {
                    if (field.id === editClaimId) return null
                    return (
                      <TouchableOpacity
                        onPress={() => handleShowEditForm(key, field.id)}
                        key={field.id}
                      >
                        <Field.Static
                          key={field.id}
                          value={Object.values(field.value).join(' ')}
                        />
                      </TouchableOpacity>
                    )
                  })
                ) : (
                  <Field.Empty>
                    <PencilIcon />
                  </Field.Empty>
                )}
              </Widget>
            ) : null}
            {key === expandedForm && formConfig && (
              <Formik
                onSubmit={handleCredentialSubmit}
                initialValues={formInitial}
              >
                {({ handleChange, handleSubmit, values }) => (
                  <View>
                    <FormHeader>
                      <FormHeader.Cancel onCancel={handleHideForm} />
                      <FormHeader.Done onSubmit={handleSubmit} />
                    </FormHeader>
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
                  </View>
                )}
              </Formik>
            )}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  group: {
    marginBottom: 20,
  },
})

export default IdentityCredentials
