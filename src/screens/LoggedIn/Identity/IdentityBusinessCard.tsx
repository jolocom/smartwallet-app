import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Dots from '~/components/Dots';
import { getGroupedValuesForBusinessCard } from '~/modules/attributes/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
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
    <BusinessCard.Styled.FieldName>{strings.COMPANY}</BusinessCard.Styled.FieldName>
    <BusinessCard.Styled.FieldValue color={Colors.white21}>{strings.NOT_SPECIFIED}</BusinessCard.Styled.FieldValue>
   </BusinessCard.Styled.FieldGroup>
   </View>
   <BusinessCard.Styled.FieldGroup>
    <BusinessCard.Styled.FieldName>{strings.CONTACT_ME}</BusinessCard.Styled.FieldName>
    <BusinessCard.Styled.FieldValue color={Colors.white21}>{strings.NOT_SPECIFIED}</BusinessCard.Styled.FieldValue>
   </BusinessCard.Styled.FieldGroup>
  </BusinessCard>
 )
}

export const BusinessCardCredential = () => {
  const {name, contact, company} = useSelector(getGroupedValuesForBusinessCard);
  const displyedName = name.fields.map(f => f.value).join(' ');
  
  return (
    <BusinessCard>
      <View>
        <BusinessCard.Styled.Title>{displyedName}</BusinessCard.Styled.Title>
        <BusinessCard.Styled.FieldGroup customStyles={{marginTop: 3}}>
          <BusinessCard.Styled.FieldName>{company.label}</BusinessCard.Styled.FieldName>
          {company.fields.map(f => (
          <BusinessCard.Styled.FieldValue color={Colors.white}>{f.value}</BusinessCard.Styled.FieldValue>
          ))}
        </BusinessCard.Styled.FieldGroup>
      </View>
      <BusinessCard.Styled.FieldGroup customStyles={{marginTop: 3}}>
          <BusinessCard.Styled.FieldName>{contact.label}</BusinessCard.Styled.FieldName>
          {contact.fields.map(f => (
          <BusinessCard.Styled.FieldValue color={Colors.white}>{f.value}</BusinessCard.Styled.FieldValue>
          ))}
        </BusinessCard.Styled.FieldGroup>

    </BusinessCard>
  )
}


