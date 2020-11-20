import React from 'react'
import { strings } from '~/translations'
import TabsContainer from './Container'
import Tabs from './Tabs'

const HistoryTabs: React.FC = ({ children }) => (
  <Tabs initialActiveSubtab={strings.ALL}>
    <TabsContainer>
      <Tabs.Subtab>{strings.ALL}</Tabs.Subtab>
      <Tabs.Subtab>{strings.SHARED}</Tabs.Subtab>
      <Tabs.Subtab>{strings.RECEIVED}</Tabs.Subtab>
    </TabsContainer>

    <Tabs.Panel>{children}</Tabs.Panel>
  </Tabs>
)

export default HistoryTabs
