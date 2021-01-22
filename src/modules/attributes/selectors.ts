import { createSelector } from 'reselect'
import { attributeConfig } from '~/config/claims'
import { strings } from '~/translations'
import { AttributeTypes, ClaimKeys, IAttributeClaimFieldWithValue } from '~/types/credentials'
import { RootReducerI } from '~/types/reducer'
import { AttrsState, AttributeI } from './types'

export const getAttributes = (state: RootReducerI): AttrsState<AttributeI> =>
  state.attrs.all

export const getBusinessCardAttributeWithValuesUI = createSelector(
  [getAttributes],
  (attributes) => {
    const businessCardCredentials = attributes[AttributeTypes.businessCard] ?? [];
    if (businessCardCredentials.length) {
      const businessCardClaimFields = attributeConfig[AttributeTypes.businessCard].fields.reduce<IAttributeClaimFieldWithValue[]>((formattedFields, field) => {
        let updatedFieldToAdd: IAttributeClaimFieldWithValue;
        const fieldValue = businessCardCredentials[0].value[field.key];

        if (field.key === ClaimKeys.familyName || field.key === ClaimKeys.givenName) {
          const nameField: IAttributeClaimFieldWithValue | undefined = formattedFields.find(f => f.key === ClaimKeys.fullName);
          updatedFieldToAdd = nameField
            ? { ...nameField, value: `${nameField.value} ${fieldValue}` }
            : { key: ClaimKeys.fullName, label: strings.NAME, value: `${fieldValue}`, keyboardOptions: { keyboardType: 'default', autoCapitalize: 'words' } };
          formattedFields = formattedFields.filter(f => f.key !== ClaimKeys.fullName);
        } else if (field.key === ClaimKeys.telephone || field.key === ClaimKeys.email) {
          const contactField: IAttributeClaimFieldWithValue | undefined = formattedFields.find(f => f.key === ClaimKeys.contact);
          updatedFieldToAdd = contactField
          ? { ...contactField, value: `${contactField.value} ${fieldValue}` }
          : { key: ClaimKeys.contact, label: strings.CONTACT_ME, value: `${fieldValue}`, keyboardOptions: { keyboardType: 'default', autoCapitalize: 'words' } };
          formattedFields = formattedFields.filter(f => f.key !== ClaimKeys.contact);
        } else if(field.key === ClaimKeys.legalCompanyName) {
          updatedFieldToAdd = { ...field, label: strings.COMPANY, value: fieldValue };
        } else {
          updatedFieldToAdd = { ...field, value: fieldValue }
        }

        return [...formattedFields, updatedFieldToAdd]
      }, []);
      return businessCardClaimFields;
    }
    return []
  }
)