import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { withNextInputAutoFocusForm, withNextInputAutoFocusInput } from 'react-native-formik';
import { useSelector } from 'react-redux';
import Block from '~/components/Block';
import FormHeader from '~/components/FormHeader';
import { attributeConfig } from '~/config/claims';
import { useSICActions } from '~/hooks/attributes';
import { useToasts } from '~/hooks/toasts';
import { getBusinessCardAttributes, getBusinessCardId } from '~/modules/attributes/selectors';
import { AttributeTypes } from '~/types/credentials';
import { assembleFormInitialValues } from '~/utils/dataMapping';
import { getAttributeConfigWithValues, getGroupedClaimsBusinessCard } from '~/utils/mappings/groupBusinessCard';
import Input from '~/components/Input';
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText';
import { JoloTextSizes } from '~/utils/fonts';
import { Colors } from '~/utils/colors';

interface IEditBC {
  onCancel: () => void
}

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const BusinessCardEdit: React.FC<IEditBC> = ({ onCancel }) => {
  // if selector returns something we edit claim, otherwise we add new claim
  const businessCardId = useSelector(getBusinessCardId)
  const businessCards = useSelector(getBusinessCardAttributes);
  const businessCardWithValues = getAttributeConfigWithValues(AttributeTypes.businessCard, businessCardId ? businessCards[0].value : undefined); 
  // used to support UI groupings 
  const groupedBC = getGroupedClaimsBusinessCard(businessCardWithValues);

  const formInitial = assembleFormInitialValues(businessCardWithValues.fields);

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
  
  const renderFormHeader = (claims: Record<string, string>) => {
    return (
      <FormHeader>
        <FormHeader.Cancel onCancel={onCancel} />
        <FormHeader.Done onSubmit={() => handleFormSubmit(claims)} />
      </FormHeader>
    )
  }

  const renderSectionHeader = (sectionLabel: string) => {
    return (
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.mini}
        color={Colors.white50}
        weight={JoloTextWeight.regular}
        customStyles={{ marginBottom: 5 }}
      >
        {sectionLabel}
      </JoloText>
    )
  }

  const renderSectionFooter = (sectionLabel: string) => <View style={{ marginBottom: 15 }} />

  return (
    <Block customStyle={{paddingHorizontal: 20, paddingVertical: 25}}>
      <Formik initialValues={formInitial} onSubmit={handleFormSubmit}>
        {({ handleChange, values }) => (
        <>
          {renderFormHeader(values)}
          <AutofocusContainer>
            {Object.keys(groupedBC).map((groupKey: string, groupIdx) => {
              return (
                <>
                  {renderSectionHeader(groupKey)}
                  {groupedBC[groupKey].map((f, idx) => (
                    <AutofocusInput
                      autoFocus={groupIdx === 0 && idx === 0}
                      // @ts-ignore name prop isn't supported by TextInput component
                      name={f.key}
                      key={f.key}
                      value={values[f.key]}
                      updateInput={handleChange(f.key)}
                      placeholder={f.label}
                      {...f.keyboardOptions}
                    />
                  ))}                  
                  {renderSectionFooter(groupKey)}
                </>
              )
            })}
            </AutofocusContainer> 
          </>  
        )}
      </Formik>
    </Block>
  )
}

export default BusinessCardEdit