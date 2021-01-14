import { createSelector } from 'reselect'
import { attributeConfig } from '~/config/claims'
import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { RootReducerI } from '~/types/reducer'
import { AttrsState, AttributeI } from './types'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

// TODO: remove claim if it is empty 
export const getBusinessCardAttributeWithValues = createSelector(
  [getAttributes],
  (attributes) => {
    const businessCardCredentials = attributes[AttributeTypes.businessCard] ?? [];
    if (businessCardCredentials.length) {
      return attributeConfig[AttributeTypes.businessCard].fields.reduce((formattedFields, field) => {
        if (field.key === ClaimKeys.familyName || field.key === ClaimKeys.givenName) {
          const nameField = formattedFields.find(f => f.key === 'fullName');
          const fullName = nameField ? { ...nameField, value: `${nameField.value} ${businessCardCredentials[0].value[field.key]}` } : { key: 'fullName', label: 'Name', value: `${businessCardCredentials[0].value[field.key]}`, keyboardOptions: { keyboardType: 'default', autoCapitalize: 'words' } };
          formattedFields = formattedFields.filter(f => f.key !== 'fullName');
          formattedFields = [...formattedFields, fullName]
        } else if (field.key === ClaimKeys.telephone) {
          const editedTelephone = { ...field, label: 'Contact', value: businessCardCredentials[0].value[field.key] }
          formattedFields = [...formattedFields, editedTelephone]
        }
        else if (field.key === ClaimKeys.legalCompanyName) {
          formattedFields = [...formattedFields, { ...field, value: businessCardCredentials[0].value[field.key] }]
        }
        return formattedFields;
      }, []);
    }
    return []
  }
)