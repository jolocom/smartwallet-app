import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Dots from '~/components/Dots';
import { useSICActions } from '~/hooks/attributes';
import { useToasts } from '~/hooks/toasts';
import { getBusinessCardAttributes, getGroupedValuesForBusinessCard } from '~/modules/attributes/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import Styled, {IStyledComposition} from './components/Styled';

enum Modes {
 none = 'none',
 edit = 'edit'
}

interface IBusinessCardComposition {
  Styled: IStyledComposition
}

const BusinessCardPlaceholder = () => {
 return (
  <>
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
  </>
 )
}

const BusinessCardCredential: React.FC = () => {
  const groupedValuesBC = useSelector(getGroupedValuesForBusinessCard);

  const {name, contact, company} = groupedValuesBC;
  if(!name && !contact && !company) return null;

  const displyedName = name.fields.map(f => f.value).join(' ');
  
  return (
    <>
      <View>
        <BusinessCard.Styled.Title color={Colors.white}>{displyedName}</BusinessCard.Styled.Title>
        <BusinessCard.Styled.FieldGroup customStyles={{marginTop: 3}}>
          <BusinessCard.Styled.FieldName>{company.label}</BusinessCard.Styled.FieldName>
          {company.fields.map(f => (
          <BusinessCard.Styled.FieldValue key={f.key} color={Colors.white}>{f.value}</BusinessCard.Styled.FieldValue>
          ))}
        </BusinessCard.Styled.FieldGroup>
      </View>
      <BusinessCard.Styled.FieldGroup customStyles={{marginTop: 3}}>
          <BusinessCard.Styled.FieldName>{contact.label}</BusinessCard.Styled.FieldName>
          {contact.fields.map(f => (
            <>
            {f.value ? (

              <BusinessCard.Styled.FieldValue key={f.key} color={Colors.white}>{f.value}</BusinessCard.Styled.FieldValue>
              ): null}
          </>
          ))}
        </BusinessCard.Styled.FieldGroup>

    </>
  )
}

const BusinessCard: React.FC & IBusinessCardComposition = () => {
  const [mode, setMode] = useState(Modes.none);
  const {handleDeleteCredentialSI} = useSICActions();
 
  const businessCardCredenetials = useSelector(getBusinessCardAttributes);
  const {scheduleWarning} = useToasts();
  
  const isPlaceholder = !Boolean(businessCardCredenetials?.length);
 
  const setEditMode = () => setMode(Modes.edit)
  const resetMode = () => setMode(Modes.none);
 
  const handleDeleteBC = async () => {
    try {
      await handleDeleteCredentialSI(businessCardCredenetials[0].id);
    } catch(e) {
      scheduleWarning({
        title: 'Could not delete',
        message: 'Failed to delete business card'
      })
    } finally {
      resetMode();  
    }
  }
 
  const popupOptions = useMemo(() => ([
   {
    title: strings.EDIT,
    onPress: setEditMode
   },
     ...(!isPlaceholder ? [{
       title: strings.DELETE,
       onPress: handleDeleteBC
      }] : [])
  ]), [])
 
  /* TODO: business card form will go here
  if(mode === Modes.edit) {
    return null
  }
  */
  return (
   <BusinessCard.Styled.Container>
     <Dots color={Colors.white} customStyles={{ right: -10, top: -12 }} options={popupOptions} />
     {isPlaceholder ? (
       <BusinessCardPlaceholder />
     ) : (
       <BusinessCardCredential />
     )}
   </BusinessCard.Styled.Container>
  )
 }

BusinessCard.Styled = Styled;


export default BusinessCard


