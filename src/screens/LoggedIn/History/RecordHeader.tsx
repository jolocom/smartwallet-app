import React from 'react'
import { IRecordHeader } from './types'
import { useRecord } from './context'
import ScreenContainer from '~/components/ScreenContainer'
import { useTranslation } from 'react-i18next'

const RecordHeader: React.FC<IRecordHeader> = ({
  title,
  testID = 'record-header',
}) => {
  const { t } = useTranslation()
  const { activeSection } = useRecord()
  return (
    <ScreenContainer.Header testID={testID} customStyles={{ marginBottom: 18 }}>
      {t(
        // @ts-expect-error
        title ||
          (Object.values(activeSection)[0] as string) ||
          'BottomBar.history',
      )}
    </ScreenContainer.Header>
  )
}

export default RecordHeader
