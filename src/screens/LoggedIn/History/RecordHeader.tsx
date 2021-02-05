import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { IRecordHeader, useRecord } from './Record'
import ScreenContainer from '~/components/ScreenContainer'

const RecordHeader: React.FC<IRecordHeader> = ({ title }) => {
  const { activeSection } = useRecord()
  return (
    <ScreenContainer.Header customStyles={{ marginBottom: 18 }}>
      {title || (Object.values(activeSection)[0] as string) || 'Loading...'}
    </ScreenContainer.Header>
  )
}

export default RecordHeader
