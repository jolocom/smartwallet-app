import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
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
import MoveToNext from '~/components/MoveToNext';
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll';

interface IEditBC {
  onCancel: () => void
}

const BusinessCardEdit: React.FC<IEditBC> = ({ onCancel }) => {
  // if selector returns something we edit claim, otherwise we add new claim
  const businessCardId = useSelector(getBusinessCardId)
  const businessCards = useSelector(getBusinessCardAttributes)
  const businessCardWithValues = getAttributeConfigWithValues(
    AttributeTypes.businessCard,
    businessCardId ? businessCards[0].value : undefined,
  )
  // used to support UI groupings
  const groupedBC = getGroupedClaimsBusinessCard(businessCardWithValues)

  const formInitial = assembleFormInitialValues(businessCardWithValues.fields)

  const { handleEditCredentialSI, handleCreateCredentialSI } = useSICActions()
  const { scheduleWarning } = useToasts()

  const handleFormSubmit = async (claims: Record<string, string>) => {
    // TODO: check if id values are the same or dismiss
    try {
      if (businessCardId) {
        // edit mode
        await handleEditCredentialSI(
          AttributeTypes.businessCard,
          claims,
          attributeConfig[AttributeTypes.businessCard].metadata,
          businessCardId,
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

  const renderSectionFooter = (sectionLabel: string) => (
    <View style={{ marginBottom: 15 }} />
  )

  /* This delay is for managing to autofocus the first field in the form,
     otherwise, it focuses and blurs for unknown reasons 
  */
  const [areFieldsVisible, setFieldsVisibility] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFieldsVisibility(true);
    }, 100);
  }, [])

  return (
    <Block
      customStyle={{
        paddingHorizontal: 20,
        paddingVertical: 25,
        marginBottom: '30%',
      }}
    >
      <Formik initialValues={formInitial} onSubmit={handleFormSubmit}>
        {({ handleChange, values }) => (
        <>
            {renderFormHeader(values)}
            {/* NOTE: we are not using Formik HOCs for focusing next input,
            as it doesn't support non-direct children as Inputs,
            but we need to support it to enable section names */}
            <MoveToNext>
              {Object.keys(groupedBC).map((groupKey: string, groupIdx) => {
                return (
                  <View key={groupKey}>
                    {renderSectionHeader(groupKey)}
                    {areFieldsVisible && groupedBC[groupKey].map((f, idx) => (
                      <JoloKeyboardAwareScroll.InputContainer>
                        {({ focusInput }) => (
                          <MoveToNext.InputsCollector key={f.key}>
                            <Input.Block
                              {...(groupIdx === 0 && idx === 0 ? {autoFocus: true} : {autoFocus: false})}
                              // @ts-ignore name prop isn't supported by TextInput component
                              name={f.key}
                              value={values[f.key]}
                              updateInput={handleChange(f.key)}
                              placeholder={f.label}
                              onFocus={focusInput}
                              {...f.keyboardOptions}
                              />
                          </MoveToNext.InputsCollector>
                        )}
                      </JoloKeyboardAwareScroll.InputContainer>
                      ))}                  
                    {renderSectionFooter(groupKey)}
                  </View>
                )
              })}
            </MoveToNext>
          </>  
        )}
      </Formik>
    </Block>
  )
}

export default BusinessCardEdit
