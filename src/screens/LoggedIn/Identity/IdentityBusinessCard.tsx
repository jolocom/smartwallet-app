import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Btn from '~/components/Btn';
import Dots from '~/components/Dots';
import SectionForm from '~/components/Form/SectionForm';
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText';
import { useSICActions } from '~/hooks/attributes';
import { useToasts } from '~/hooks/toasts';
import { getBusinessCardAttributes, getGroupedValuesForBusinessCard } from '~/modules/attributes/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';
import { getGroupedClaimsForBusinessCard, TClaimGroups } from '~/utils/mappings/groupBusinessCard';
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
  if(!groupedValuesBC) return null;

  const {name, contact, company} = groupedValuesBC;

  const displayedName = name.fields.map(f => f.value).join(' ');
  
  return (
    <>
      <View>
        <BusinessCard.Styled.Title color={Colors.white}>{displayedName}</BusinessCard.Styled.Title>
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

const BusinessCardEdit = ({onCancel}) => {
  const groupedClaimsBC = getGroupedClaimsForBusinessCard()
  return (
    <>
    <Btn onPress={onCancel}>cancel</Btn>
    <SectionForm
      config={groupedClaimsBC}
      renderFormHeader={(formState: TClaimGroups) => <JoloText>Form Header</JoloText>}
      renderSectionHeader={(section) => <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini} color={Colors.white50} weight={JoloTextWeight.regular} customStyles={{ marginBottom: 5 }}>{section.label}</JoloText>}
      renderSectionFooter={() => <View style={{marginBottom: 15}} />}
      />
    </>
  )
}

const BusinessCard: React.FC & IBusinessCardComposition = () => {
  const [mode, setMode] = useState(Modes.none);
  const {handleDeleteCredentialSI} = useSICActions();
 
  const businessCardCredentials = useSelector(getBusinessCardAttributes);
  const {scheduleWarning} = useToasts();
  
  const isPlaceholder = !Boolean(businessCardCredentials?.length);
 
  const setEditMode = () => setMode(Modes.edit)
  const resetMode = () => setMode(Modes.none);
 
  const handleDeleteBC = async () => {
    try {
      await handleDeleteCredentialSI(businessCardCredentials[0].id);
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
 
  if(mode === Modes.edit) {
    return <BusinessCardEdit onCancel={resetMode} />
  }
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


