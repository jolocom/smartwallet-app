import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import SectionForm from '~/components/Form/SectionForm';
import FormHeader from '~/components/FormHeader';
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText';
import { attributeConfig } from '~/config/claims';
import { useSICActions } from '~/hooks/attributes';
import { useToasts } from '~/hooks/toasts';
import { getBusinessCardId } from '~/modules/attributes/selectors';
import { AttributeTypes } from '~/types/credentials';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

interface IEditBC {
  onCancel: () => void
}

const BusinessCardEdit: React.FC<IEditBC> = ({ onCancel }) => {
  // if selector returns something we edit claim, otherwise we add new claim
  const businessCardId = useSelector(getBusinessCardId)

  const { handleEditCredentialSI, handleCreateCredentialSI } = useSICActions()
  const { scheduleWarning } = useToasts();

  const handleFormSubmit = async (claims: Record<string, string>) => {
    // TODO: check if id values are the same or dismiss 
    try {
      if (businessCardId) {
        // edit mode
        await handleEditCredentialSI(
          AttributeTypes.businessCard,
          claims,
          attributeConfig[AttributeTypes.businessCard].metadata,
          businessCardId
        )
      } else {
        // add mode
        await handleCreateCredentialSI(
          AttributeTypes.businessCard,
          claims,
          attributeConfig[AttributeTypes.businessCard].metadata,
        )
      }
    } catch (e) {
      scheduleWarning({
        title: 'Error editing BC',
        message: 'There was an error editing your business card',
      })
    } finally {
      onCancel()
    }
  }
  
  const handleRenderFormHeader = (claims: Record<string, string>) => {
    return (
      <FormHeader>
        <FormHeader.Cancel onCancel={onCancel} />
        <FormHeader.Done onSubmit={() => handleFormSubmit(claims)} />
      </FormHeader>
    )
  }
  return (
    <SectionForm
      renderFormHeader={handleRenderFormHeader}
      renderSectionHeader={(sectionLabel) => (
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.mini}
          color={Colors.white50}
          weight={JoloTextWeight.regular}
          customStyles={{ marginBottom: 5 }}
        >
          {sectionLabel}
        </JoloText>
      )}
      renderSectionFooter={() => <View style={{ marginBottom: 15 }} />}
    />
  )
}

export default BusinessCardEdit