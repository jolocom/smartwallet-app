import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Btn, { BtnTypes } from '~/components/Btn';
import Dots from '~/components/Dots';
import JoloText from '~/components/JoloText';
import { getBusinessCardAttributeWithValuesUI } from '~/modules/attributes/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';
import Styled from './components/Styled';

enum Modes {
 none = 'none',
 edit = 'edit'
}

const BusinessCard: React.FC = ({children}) => {
 const [mode, setMode] = useState(Modes.none);

 const setEditMode = () => setMode(Modes.edit)
 const resetMode = () => setMode(Modes.none);

 const popupOptions = useMemo(() => ([
  {
   title: strings.EDIT,
   onPress: setEditMode
  },
 ]), [])

 return (
  <BusinessCard.Styled.Container>
    <Dots color={Colors.white} customStyles={{ right: -10, top: -12 }} options={popupOptions} />
    {children}
  </BusinessCard.Styled.Container>
 )
}

BusinessCard.Styled = Styled;

export const BusinessCardPlaceholder = () => {
 return (
  <BusinessCard>
   <View>
    <BusinessCard.Styled.Title color={Colors.white45}>{strings.YOUR_NAME}</BusinessCard.Styled.Title>
    <BusinessCard.Styled.FieldGroup customStyles={{marginTop: 3}}>
    <BusinessCard.Styled.FieldName>{strings.COMPANY}:</BusinessCard.Styled.FieldName>
    <BusinessCard.Styled.FieldValue color={Colors.white21}>{strings.NOT_SPECIFIED}</BusinessCard.Styled.FieldValue>
   </BusinessCard.Styled.FieldGroup>
   </View>
   <BusinessCard.Styled.FieldGroup>
    <BusinessCard.Styled.FieldName>{strings.CONTACT_ME}:</BusinessCard.Styled.FieldName>
    <BusinessCard.Styled.FieldValue color={Colors.white21}>{strings.NOT_SPECIFIED}</BusinessCard.Styled.FieldValue>
   </BusinessCard.Styled.FieldGroup>
  </BusinessCard>
 )
}

const BusinessCardCredential = () => {
 const businessCardAttribute = useSelector(getBusinessCardAttributeWithValuesUI);
 console.log({businessCardAttribute});
 

 const [mode, setMode] = useState(Modes.none);

 const setEditMode = () => setMode(Modes.edit)
 const resetMode = () => setMode(Modes.none);

 const popupOptions = useMemo(() => ([
  {
   title: strings.EDIT,
   onPress: setEditMode
  },
 ]), [])

 // NOTO: this is only for testing purposes
 if (!businessCardAttribute.length && __DEV__) {
  return <JoloText>Create business card to see its content</JoloText>
 } else if (mode === Modes.edit) {
  return (
   <>
    <JoloText>Business Card Form...</JoloText>
    <Btn type={BtnTypes.senary} onPress={resetMode}>Cancel</Btn>
   </>
  )
 } else {
  return (
   <BusinessCard>
    {businessCardAttribute.length ? businessCardAttribute.map(field => (
     <View key={field.key}>
      <JoloText size={JoloTextSizes.mini} color={Colors.white40} customStyles={{ textAlign: 'left', marginBottom: 3 }}>{field.label}</JoloText>
      {businessCardAttribute.length && (
       <JoloText size={JoloTextSizes.big} color={Colors.white80} customStyles={{ textAlign: 'left', marginBottom: 13 }}>{field.value}</JoloText>
      )}
     </View>
    )
    ) : null}
   </BusinessCard>
  )
 }
}


