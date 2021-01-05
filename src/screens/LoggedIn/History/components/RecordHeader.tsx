import React from 'react';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { JoloTextSizes } from '~/utils/fonts';
import { useRecord } from './Record';

const RecordHeader = () => {
  const { activeSection } = useRecord();
  return (
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      customStyles={{ textAlign: 'left', marginBottom: 22, width: '100%' }}
    >
      {/* TODO: think about placeholder for the header when no interactions are there */}
      {activeSection || 'No interactions yet...'}
    </JoloText>
  )
}

export default RecordHeader;