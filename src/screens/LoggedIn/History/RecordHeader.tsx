import React from 'react'
import { IRecordHeader } from './types'
import { useRecord } from './context'
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
