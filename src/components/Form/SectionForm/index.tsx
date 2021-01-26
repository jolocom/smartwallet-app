import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential';
import React, { useState } from 'react';
import {View } from 'react-native';
import Input from '~/components/Input';
import { ClaimKeys } from '~/types/credentials';
// TODO: think about where to place this file
import { TClaimGroups, Group } from '~/utils/mappings/groupBusinessCard';
import MoveToNext from '../MoveToNext';

interface ISectionForm {
  config: TClaimGroups,
  renderFormHeader?: (formState: TClaimGroups) => React.FC
  renderSectionHeader?: (section: Group) => React.FC
  renderSectionFooter?: (section: Group) => React.FC
}

const SectionForm: React.FC<ISectionForm> = ({ config, renderFormHeader, renderSectionHeader, renderSectionFooter }) => {
  const initialState = config;
  const [state, setState] = useState<TClaimGroups>(initialState);

  const handleFieldValueChange = (sectionKey: string, fieldKey: ClaimKeys, fieldValue: ClaimEntry) => {
    state[sectionKey].updateFieldValue(fieldKey, fieldValue);
    setState(prevState => ({...prevState, [sectionKey]: state[sectionKey]}))
  }

  return (
    <View>
      {renderFormHeader ? renderFormHeader(state) : renderFormHeader}
      <MoveToNext>
      {Object.keys(state).map(sectionKey => {
        const section = state[sectionKey];
        return (
          <>
            {renderSectionHeader ? renderSectionHeader(section) : null}
              {section.fields.map(f => (
                <MoveToNext.InputsCollector key={f.key}>
                  <Input.Block value={f.value} updateInput={(val) => handleFieldValueChange(sectionKey, f.key, val)}  />
                </MoveToNext.InputsCollector>
              ))}
              {renderSectionFooter ? renderSectionFooter(section) : null}
          </>
        )
      })}
      </MoveToNext>
    </View>
  )
}

export default SectionForm;