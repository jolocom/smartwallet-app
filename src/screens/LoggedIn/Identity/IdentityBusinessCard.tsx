import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Block from '~/components/Block';
import JoloText from '~/components/JoloText';
import { attributeConfig } from '~/config/claims';
import { getAttributes } from '~/modules/attributes/selectors';
import { AttributeI } from '~/modules/attributes/types';
import { strings } from '~/translations';
import { AttributeTypes, ClaimKeys } from '~/types/credentials';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

const getPlaceholderStyles = (height: number, width: string | number, bg: Colors, br: number, mb: number) => ({
 height, width, backgroundColor: bg, borderRadius: br, marginBottom: mb
})

const PlaceholderMini = () => <Block customStyle={getPlaceholderStyles(16, '33.1%', Colors.portGore, 5, 10)} />
const PlaceholderBig = () => <Block customStyle={getPlaceholderStyles(33, '100%', Colors.portGore, 5, 15)} />

const Placeholder = {
 Mini: PlaceholderMini,
 Big: PlaceholderBig
}

const BusinessCardPlaceholder = () => {
 return (
  <>
   {[...Array(3).keys()].map(el => (
    <View key={el}>
     <Placeholder.Mini />
     <Placeholder.Big />
    </View>
   ))}
  </>
 )
}

const getBusinessCardCredentialIntoUI = (businessCardCredential: AttributeI) => attributeConfig[AttributeTypes.businessCard].fields.reduce((formattedFields, field) => {
 if (field.key === ClaimKeys.familyName || field.key === ClaimKeys.givenName) {
  const nameField = formattedFields.find(f => f.key === 'fullName');
  const fullName = nameField ? { ...nameField, value: `${nameField.value} ${businessCardCredential.value[field.key]}` } : { key: 'fullName', label: 'Name', value: `${businessCardCredential.value[field.key]}`, keyboardOptions: { keyboardType: 'default', autoCapitalize: 'words' } };
  formattedFields = formattedFields.filter(f => f.key !== 'fullName');
  formattedFields = [...formattedFields, fullName]
 } else if (field.key === ClaimKeys.telephone) {
  const editedTelephone = { ...field, label: 'Contact', value: businessCardCredential.value[field.key] }
  formattedFields = [...formattedFields, editedTelephone]
 }
 else if (field.key === ClaimKeys.legalCompanyName) {
  formattedFields = [...formattedFields, { ...field, value: businessCardCredential.value[field.key] }]
 }
 return formattedFields;
}, []);


const BusinessCardCredential = () => {
 const attributes = useSelector(getAttributes);
 const businessCardAttributes = attributes[AttributeTypes.businessCard] || [];
 const businessCardFormatted = useMemo(() => {
  return getBusinessCardCredentialIntoUI(businessCardAttributes[0]);
 }, [JSON.stringify(businessCardAttributes[0])])

 console.log({ businessCardFormatted });

 return (
  <>
   {businessCardFormatted.length && businessCardFormatted.map(field => (
    <View key={field.key}>
     <JoloText size={JoloTextSizes.mini} color={Colors.white40} customStyles={{ textAlign: 'left', marginBottom: 3 }}>{field.label}</JoloText>
     {businessCardAttributes.length && (
      <JoloText size={JoloTextSizes.big} color={Colors.white80} customStyles={{ textAlign: 'left', marginBottom: 13 }}>{field.value}</JoloText>
     )}
    </View>
   ))}
  </>
 )
}

const BusinessCard = {
 Placeholder: BusinessCardPlaceholder,
 Credential: BusinessCardCredential
}

const IdentityBusinessCard = () => {
 const [isPlaceholder, setIsPlaceholder] = useState(true);
 const handlePlaceholderToggle = () => setIsPlaceholder(prevState => !prevState);
 return (
  <View style={{ width: '100%' }}>
   {/* TODO: below should be moved inside of IdentityTabs component */}
   {strings.BUSINESS_CARD_CTA_CREATE.split(',').map(t => (
    <JoloText size={JoloTextSizes.mini} color={Colors.white40} customStyles={{ lineHeight: 10 }}>{t}</JoloText>
   ))}
   <TouchableOpacity onPress={handlePlaceholderToggle}>
    <Block customStyle={{ padding: 26, alignItems: 'center', marginTop: 30 }}>
     <View style={{ width: '100%' }}>
      {isPlaceholder ? <BusinessCard.Placeholder /> : <BusinessCard.Credential />}
     </View>
    </Block>
   </TouchableOpacity>
  </View>
 )
}

export default IdentityBusinessCard;