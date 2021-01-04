import React from 'react';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { JoloTextSizes } from '~/utils/fonts';
import { useRecord } from './Record';

const RecordHeader = () => {
    const {activeSection} = useRecord();
    return (
        <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        customStyles={{ textAlign: 'left', marginBottom: 22, width: '100%' }}
      >
        {activeSection}
      </JoloText>
    )
}

export default RecordHeader;