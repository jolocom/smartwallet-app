import React, { useState } from 'react'
import FormContainer from '~/components/FormContainer'
import { useSelector } from 'react-redux'
import {
  getBusinessCardId,
  getBusinessCardAttributes,
} from '~/modules/attributes/selectors'
import { AttributeTypes } from '~/types/credentials'
import { attributeConfig } from '~/config/claims'
import {
  getGroupedClaimsBusinessCard,
  getAttributeConfigWithValues,
} from '~/utils/mappings/groupBusinessCard'
import { Formik } from 'formik'
import MoveToNext from '~/components/MoveToNext'
import { View } from 'react-native'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import Input from '~/components/Input'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { assembleFormInitialValues } from '~/utils/dataMapping'
import { useSICActions } from '~/hooks/attributes'
import { useToasts } from '~/hooks/toasts'
import { useNavigation } from '@react-navigation/native'
import { strings } from '~/translations'

const BusinessCardForm = () => {
  const navigation = useNavigation()
  const businessCardId = useSelector(getBusinessCardId)
  const businessCards = useSelector(getBusinessCardAttributes)

  const businessCardWithValues = getAttributeConfigWithValues(
    AttributeTypes.businessCard,
    businessCardId ? businessCards[0].value : undefined,
  )

  const groupedBC = getGroupedClaimsBusinessCard(businessCardWithValues)

  const isEditMode = !!businessCardId

  const formInitial = assembleFormInitialValues(businessCardWithValues.fields)

  const { handleEditCredentialSI, handleCreateCredentialSI } = useSICActions()
  const { scheduleWarning } = useToasts()

  const handleFormSubmit = async (claims: Record<string, string>) => {
    // TODO: check if id values are the same or dismiss
    try {
      if (isEditMode && businessCardId) {
        await handleEditCredentialSI(
          AttributeTypes.businessCard,
          claims,
          attributeConfig[AttributeTypes.businessCard].metadata,
          businessCardId,
        )
      } else {
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
      navigation.goBack()
    }
  }

  const renderSectionHeader = (sectionLabel: string) => {
    return (
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.mini}
        color={Colors.white50}
        weight={JoloTextWeight.regular}
        customStyles={{ marginBottom: 24 }}
      >
        {sectionLabel}
      </JoloText>
    )
  }

  const renderSectionFooter = () => <View style={{ marginBottom: 32 }} />

  return (
    <Formik initialValues={formInitial} onSubmit={handleFormSubmit}>
      {({ handleChange, values }) => (
        <FormContainer
          title={
            isEditMode
              ? strings.EDIT_BUSINESS_CARD
              : strings.CREATE_BUSINESS_CARD
          }
          description={
            strings.ONCE_YOU_CLICK_DONE_IT_WILL_BE_DISPLAYED_IN_THE_PERSONAL_INFO_SECTION
          }
          onSubmit={() => handleFormSubmit(values)}
        >
          {/* NOTE: we are not using Formik HOCs for focusing next input,
            as it doesn't support non-direct children as Inputs,
            but we need to support it to enable section names */}
          <MoveToNext>
            {Object.keys(groupedBC).map((groupKey: string, groupIdx) => {
              return (
                <View key={groupKey}>
                  {renderSectionHeader(groupKey)}
                  {groupedBC[groupKey].map((f, idx) => (
                    <JoloKeyboardAwareScroll.InputContainer>
                      {({ focusInput }) => (
                        <MoveToNext.InputsCollector
                          key={f.key}
                          onSubmit={() => handleFormSubmit(values)}
                        >
                          <Input.Block
                            {...(groupIdx === 0 && idx === 0
                              ? { autoFocus: true }
                              : { autoFocus: false })}
                            // @ts-ignore name prop isn't supported by TextInput component
                            name={f.key}
                            value={values[f.key]}
                            updateInput={handleChange(f.key)}
                            placeholder={f.label}
                            onFocus={focusInput}
                            containerStyle={{ marginBottom: 12 }}
                            {...f.keyboardOptions}
                          />
                        </MoveToNext.InputsCollector>
                      )}
                    </JoloKeyboardAwareScroll.InputContainer>
                  ))}
                  {renderSectionFooter()}
                </View>
              )
            })}
          </MoveToNext>
        </FormContainer>
      )}
    </Formik>
  )
}

export default BusinessCardForm
