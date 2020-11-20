import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import HistoryTabs from '~/components/Tabs/HistoryTabs'

const History: React.FC = () => {
  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <HistoryTabs />
    </ScreenContainer>
  )
}

export default History
