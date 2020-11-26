import React from 'react'
import { strings } from '~/translations'
import TabsContainer from './Container'
import Tabs from './Tabs'

const SUBTABS = [
  { id: 'all', value: strings.ALL },
  { id: 'shared', value: strings.SHARED },
  { id: 'received', value: strings.RECEIVED },
]

const HistoryTabs: React.FC = ({ children }) => (
  <Tabs initialActiveSubtab={SUBTABS[0]}>
    <TabsContainer>
      {SUBTABS.map((st) => (
        <Tabs.Subtab key={st.id} tab={st} />
      ))}
    </TabsContainer>

    <Tabs.Panel>{children}</Tabs.Panel>
  </Tabs>
)

export default HistoryTabs
