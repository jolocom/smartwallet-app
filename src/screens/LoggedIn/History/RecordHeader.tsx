import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { IRecordHeader, useRecord } from './Record'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations'

const RecordHeader: React.FC<IRecordHeader> = ({
  title,
  testID = 'record-header',
}) => {
  const { activeSection } = useRecord()
  return (
    <ScreenContainer.Header testID={testID} customStyles={{ marginBottom: 18 }}>
      {title || (Object.values(activeSection)[0] as string) || strings.HISTORY}
    </ScreenContainer.Header>
  )
}

export default RecordHeader
