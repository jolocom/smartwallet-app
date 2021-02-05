import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { withNextInputAutoFocusForm, withNextInputAutoFocusInput } from 'react-native-formik';
import { useSelector } from 'react-redux';
import Block from '~/components/Block';
import Input from '~/components/Input';
import { getBusinessCardAttributes } from '~/modules/attributes/selectors';
import { AttributeTypes } from '~/types/credentials';
import { assembleFormInitialValues } from '~/utils/dataMapping';
// TODO: think about where to place this file
import { getAttributeConfigWithValues, getGroupedClaimsBusinessCard } from '~/utils/mappings/groupBusinessCard';

interface ISectionForm {
  renderFormHeader?: (formState: Record<string, string>) => JSX.Element
  renderSectionHeader?: (sectionLabel: string) => JSX.Element
  renderSectionFooter?: (sectionLabel: string) => JSX.Element
}

const AutofocusInput = withNextInputAutoFocusInput(Input.Block)
const AutofocusContainer = withNextInputAutoFocusForm(View)

const noop = () => {}

const SectionForm: React.FC<ISectionForm> = ({ renderFormHeader, renderSectionHeader, renderSectionFooter }) => {
  const businessCards = useSelector(getBusinessCardAttributes);
  const businessCardWithValues = getAttributeConfigWithValues(AttributeTypes.businessCard, businessCards ? businessCards[0].value : undefined); 
  const formInitial = assembleFormInitialValues(businessCardWithValues.fields);

  const groupedBC = getGroupedClaimsBusinessCard(businessCardWithValues);

  return (
    <Block customStyle={{paddingHorizontal: 20, paddingVertical: 25}}>
      <Formik initialValues={formInitial} onSubmit={noop}>
        {({ handleChange, values }) => (
        <>
          {renderFormHeader ? renderFormHeader(values) : null}
          <AutofocusContainer>
            {Object.keys(groupedBC).map((groupKey: string, groupIdx) => {
              return (
                <>
                  {renderSectionHeader ? renderSectionHeader(groupKey) : null}
                  {groupedBC[groupKey].map((f, idx) => (
                    <AutofocusInput
                      autoFocus={groupIdx === 0 && idx === 0}
                      name={f.key as string}
                      key={f.key}
                      value={values[f.key]}
                      updateInput={handleChange(f.key)}
                      placeholder={f.label}
                      {...f.keyboardOptions}
                    />
                  ))}                  
                  {renderSectionFooter ? renderSectionFooter(groupKey) : null}
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

export default SectionForm;