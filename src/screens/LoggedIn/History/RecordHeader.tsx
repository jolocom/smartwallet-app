import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { IRecordHeader, useRecord } from './Record'

const RecordHeader: React.FC<IRecordHeader> = ({ title }) => {
  const { activeSection } = useRecord()
  return (
    <JoloText
      testID="record-header"
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      customStyles={{ textAlign: 'left', marginBottom: 22, width: '100%' }}
    >
      {/* TODO: think about placeholder for the header when no interactions are there */}
      {title || Object.values(activeSection)[0] || 'Loading...'}
    </JoloText>
  )
}

export default RecordHeader
