import React, { useEffect, useState } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'

import Input from '~/components/Input'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import Widget from '~/components/Widget'
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
import { useSICActions } from '~/hooks/attributes';

import Form from './components/Form'
import { mapFormFields } from '~/utils/dataMapping'
import { useToasts } from '~/hooks/toasts'

enum FormModes {
  add = 'add',
  edit = 'edit',
  none = 'none',
}

type TPrimiveAttributeTypes = Exclude<AttributeTypes, AttributeTypes.businessCard>
type TPrimitiveAttributesConfig = Omit<Record<AttributeTypes, IAttributeConfig>, AttributeTypes.businessCard>

const getAttributeConfigPrimitive = (): TPrimitiveAttributesConfig => {
  const { ProofOfBusinessCardCredential, ...primitiveAttributesConfig } = attributeConfig;
  return primitiveAttributesConfig;
}

const primitiveAttributesConfig = getAttributeConfigPrimitive();

const IdentityCredentials = () => {
  const [expandedForm, setExpandedForm] = useState<TPrimiveAttributeTypes | undefined>(undefined);
  const [formMode, setFormMode] = useState(FormModes.none);
  const [formConfig, setFormConfig] = useState<IAttributeConfig<IAttributeClaimFieldWithValue | IAttributeClaimField> | null>(null)
  const [editClaimId, setEditClaimId] = useState<string | undefined>(undefined); // state that shows what claim are we editing 

  const attributes = useSelector(getPrimitiveAttributes);
  const { createSICredential, editSICredential } = useSICActions();
  const { scheduleWarning } = useToasts();


  // we are not interested in claim id in 'add' mode, therefore reetting value to avoid confusions
  useEffect(() => {
    if (formMode === FormModes.add) {
      setEditClaimId(undefined);
    }
  }, [formMode])

  useEffect(() => {
    if (!expandedForm) {
      setFormMode(FormModes.none);
      setFormConfig(null);
      setEditClaimId(undefined)
    }
  }, [expandedForm])

  // update form config
  useEffect(() => {
    if (formMode === FormModes.add && expandedForm) {
      setFormConfig(primitiveAttributesConfig[expandedForm])
    } else if (formMode === FormModes.edit && expandedForm && editClaimId) {
      // NOTE: in edit more form should be aware of claim values
      const fieldsWithValues = attributeConfig[expandedForm].fields.map((f) =>
      ({
        ...f,
        value: attributes[expandedForm]?.find(a => a.id === editClaimId)?.value[f.key],
      })
      )
      setFormConfig({
        ...primitiveAttributesConfig[expandedForm],
        fields: fieldsWithValues,
      })
    }
  }, [formMode, expandedForm, editClaimId])

  const toggleForm = (cb: (type?: TPrimiveAttributeTypes) => void) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
    cb()
  }


  const handleShowForm = (mode: FormModes) => {
    return (type: TPrimiveAttributeTypes, id?: string) => {
      setFormMode(mode);
      toggleForm(() => setExpandedForm(type))
      if (id) {
        setEditClaimId(id)
      }
    }
  }
  const handleShowNewForm = handleShowForm(FormModes.add);
  const handleShowEditForm = handleShowForm(FormModes.edit);

  const handleHideForm = () => toggleForm(() => setExpandedForm(undefined))

  const handleCredentialCreate = async (formValues: IAttributeClaimFieldWithValue[]) => {
    if (expandedForm) {
      try {
        const claims = mapFormFields(formValues);
        await createSICredential(expandedForm, claims, primitiveAttributesConfig[expandedForm].metadata);
        setExpandedForm(undefined)
      } catch (e) {
        scheduleWarning({
          title: 'Error adding',
          message: 'Failed to create Self Issued Credential'
        })

      }
    }
  }

  const handleCredentialEdit = async (formValues: IAttributeClaimFieldWithValue[]) => {
    if (expandedForm && editClaimId) {
      try {
        const claims = mapFormFields(formValues);
        await editSICredential(expandedForm, claims, primitiveAttributesConfig[expandedForm].metadata, editClaimId);
        setExpandedForm(undefined)
      } catch (err) {
        scheduleWarning({
          title: 'Error editing',
          message: `Failed to edit Self Issued Credential ${editClaimId}`
        })

      }
    }
  }

  const handleCredentialSubmit = async (formValues: IAttributeClaimFieldWithValue[]) => {
    if (formMode === FormModes.add) {
      await handleCredentialCreate(formValues);
    } else if (formMode === FormModes.edit) {
      await handleCredentialEdit(formValues)
    }
  }

  const getIsWidgetShown = (type: AttributeTypes) => {
    if (type === expandedForm) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })
      if (formMode === FormModes.edit) {
        return expandedForm && Boolean(attributes[type]?.length > 1);
      } else if (formMode === FormModes.add) {
        return expandedForm && Boolean(attributes[type]?.length);
      } else {
        return true;
      }
    }
    return true;
  }


  return (
    <View testID="identity-credentials-present" style={styles.container}>
      <JoloKeyboardAwareScroll
        style={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'} // this for allowing to press cancel or submit on first tap: without this prop the issue is - if a keyboard is opened it is you need to tap twice for a btn to invoke handler  
        /* TODO: double check if these props are actually needed */
        overScrollMode="never"
        enableOnAndroid
      >
        {Object.entries<IAttributeConfig>(primitiveAttributesConfig).map(([aKey, aVal]) => {
          const key = aKey as TPrimiveAttributeTypes;
          return (
            <View style={styles.group} key={aKey}>
              {
                getIsWidgetShown(key) ? (
                  <Widget onAdd={() => handleShowNewForm(key)}>
                    <Widget.Header>
                      <Widget.Header.Name value={aVal.label} />
                      {attributes[key] && <Widget.Header.Action.CreateNew />}
                    </Widget.Header>
                    {attributes[key] ? (
                      (attributes[key] || []).map((f) => (
                        <TouchableOpacity
                          onPress={() => handleShowEditForm(key, f.id)}
                          key={f.id}
                        >
                          <Field.Static
                            key={f.id}
                            value={Object.values(f.value).join(' ')}
                          />
                        </TouchableOpacity>
                      )
                      )
                    ) : (

                        <Field.Empty>
                          <PencilIcon />
                        </Field.Empty>
                      )}
                  </Widget>
                ) : null
              }

              {aKey === expandedForm && formConfig && (
                <Form config={formConfig} onCancel={handleHideForm} onSubmit={handleCredentialSubmit}>
                  <Form.Header>
                    <Form.Header.Cancel />
                    <Form.Header.Done />
                  </Form.Header>
                  <Form.Body>
                    {({ fields, updateField }) =>
                      fields.map((field, idx) => (
                        <Input.Block
                          key={field.key}
                          updateInput={(val: string) =>
                            updateField(field.key, val)
                          }
                          value={field.value}
                          placeholder={field.label}
                          {...field.keyboardOptions}
                          autoFocus={idx === 0}
                        />
                      ))
                    }
                  </Form.Body>
                </Form>
              )}
            </View>
          )
        })}
      </JoloKeyboardAwareScroll>
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
