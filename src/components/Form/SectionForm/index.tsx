import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential';
import React, { useState } from 'react';
import Block from '~/components/Block';
import Input from '~/components/Input';
import { ClaimKeys } from '~/types/credentials';
// TODO: think about where to place this file
import { TClaimGroups, Group } from '~/utils/mappings/groupBusinessCard';
import MoveToNext from '../MoveToNext';

interface ISectionForm {
  config: TClaimGroups,
  renderFormHeader?: (formState: TClaimGroups) => JSX.Element
  renderSectionHeader?: (section: Group) => JSX.Element
  renderSectionFooter?: (section: Group) => JSX.Element
}

const SectionForm: React.FC<ISectionForm> = ({ config, renderFormHeader, renderSectionHeader, renderSectionFooter }) => {
  const initialState = config;
  const [state, setState] = useState<TClaimGroups>(initialState);

  const handleFieldValueChange = (sectionKey: string, fieldKey: ClaimKeys, fieldValue: ClaimEntry) => {
    state[sectionKey].updateFieldValue(fieldKey, fieldValue);
    setState(prevState => ({...prevState, [sectionKey]: state[sectionKey]}))
  }

  return (
    <Block customStyle={{paddingHorizontal: 20, paddingVertical: 25}}>
      {renderFormHeader ? renderFormHeader(state) : null}
      <MoveToNext>
      {Object.keys(state).map((sectionKey, idxKey) => {
        const section = state[sectionKey];
        return (
          <>
            {renderSectionHeader ? renderSectionHeader(section) : null}
            {section.fields.map((f, idx) => {
              return (
                <MoveToNext.InputsCollector key={f.key}>
                  <Input.Block
                    autoFocus={idxKey === 0 && idx === 0}
                    value={f.value}
                    updateInput={(val) => handleFieldValueChange(sectionKey, f.key, val)}
                    placeholder={f.label}
                    {...f.keyboardOptions}
                  />
                </MoveToNext.InputsCollector>
              )})}
              {renderSectionFooter ? renderSectionFooter(section) : null}
          </>
        )
      })}
      </MoveToNext>
    </Block>
  )
}

export default SectionForm;