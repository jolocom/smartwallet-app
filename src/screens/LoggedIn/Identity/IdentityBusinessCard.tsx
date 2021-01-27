import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Dots from '~/components/Dots';
import FormHeader from '~/components/Form/FormHeader';
import SectionForm from '~/components/Form/SectionForm';
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText';
import { attributeConfig } from '~/config/claims';
import { useSICActions } from '~/hooks/attributes';
import { useToasts } from '~/hooks/toasts';
import { getBusinessCardId, getGroupedValuesForBusinessCard } from '~/modules/attributes/selectors';
import { strings } from '~/translations';
import { AttributeTypes } from '~/types/credentials';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';
import { getGroupedClaimsForBusinessCard, getUngroupedClaimsForBusinessCard, Group, TClaimGroups } from '~/utils/mappings/groupBusinessCard';
import Styled, {IStyledComposition} from './components/Styled';

enum Modes {
 none = 'none',
 edit = 'edit'
}

interface IBusinessCardComposition {
  Styled: IStyledComposition
}

interface IEditBC {
  onCancel: () => void
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

// TODO: specify type
const getCopiedGroups = (groups: any) => {
  return Object.keys(groups).reduce<TClaimGroups>((copiedGroups, grKey) => {
    const { label, fields } = groups[grKey];
    copiedGroups[grKey] = new Group(label, fields);
    return copiedGroups
  }, {})
}

const BusinessCardEdit: React.FC<IEditBC> = ({ onCancel }) => {
  // if selector returns something we edit claim, otherwise we add new claim
  const businessCardId = useSelector(getBusinessCardId);
  const groupedValuesBC = useSelector(getGroupedValuesForBusinessCard) ?? getGroupedClaimsForBusinessCard();
  // we don't want to manipulate existing credential directly, and the below provide a copy of grouped claims 
  const copyGroupedValuesBC = useMemo(() => getCopiedGroups(JSON.parse(JSON.stringify(groupedValuesBC))), [JSON.stringify(groupedValuesBC)])
  const hasFormChanged = useMemo(() => JSON.stringify(groupedValuesBC) !== JSON.stringify(copyGroupedValuesBC), [JSON.stringify(groupedValuesBC)])

  const { handleEditCredentialSI, handleCreateCredentialSI } = useSICActions();
  const { scheduleWarning } = useToasts()

  const handleFormSubmit = async (formState: TClaimGroups) => {
    if (hasFormChanged) {
      try {
        if (businessCardId) {
          // edit mode
          await handleEditCredentialSI(AttributeTypes.businessCard, getUngroupedClaimsForBusinessCard(formState), attributeConfig[AttributeTypes.businessCard].metadata, businessCardId);
        } else {
          // add mode
          await handleCreateCredentialSI(AttributeTypes.businessCard, getUngroupedClaimsForBusinessCard(formState), attributeConfig[AttributeTypes.businessCard].metadata)
        }
      } catch (e) {
        scheduleWarning({
          title: 'Error editing BC',
          message: 'There was an error editing your business card'
        })
      } finally {
        onCancel();
      }
    }
    else {
      onCancel();
    }
  }
  const handleRenderFormHeader = (formState: TClaimGroups) => {
    return (
      <FormHeader>
        <FormHeader.Cancel onCancel={onCancel} />
        <FormHeader.Done onSubmit={() => handleFormSubmit(formState)} />
      </FormHeader>
    )
  }
  return (
    <SectionForm
      config={copyGroupedValuesBC}
      renderFormHeader={handleRenderFormHeader}
      renderSectionHeader={(section) => <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini} color={Colors.white50} weight={JoloTextWeight.regular} customStyles={{ marginBottom: 5 }}>{section.label}</JoloText>}
      renderSectionFooter={() => <View style={{marginBottom: 15}} />}
    />
  )
}

const BusinessCard: React.FC & IBusinessCardComposition = () => {
  const [mode, setMode] = useState(Modes.none);
  const {handleDeleteCredentialSI} = useSICActions();
 
  const businessCardId = useSelector(getBusinessCardId);
  const {scheduleWarning} = useToasts();
  
  const isPlaceholder = !Boolean(businessCardId);
 
  const setEditMode = () => setMode(Modes.edit)
  const resetMode = () => setMode(Modes.none);
 
  const handleDeleteBC = async () => {
    if (businessCardId) {
      
      try {
        await handleDeleteCredentialSI(businessCardId);
      } catch(e) {
        scheduleWarning({
          title: 'Could not delete',
          message: 'Failed to delete business card'
        })
      } finally {
        resetMode();  
      }
    }
    else {
      throw new Error('Cannot perform delete on non existent business card')
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


