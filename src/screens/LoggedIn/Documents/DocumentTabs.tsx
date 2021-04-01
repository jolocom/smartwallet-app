import React from 'react'
import { useRoute, RouteProp } from '@react-navigation/native'

import { strings } from '~/translations'
import TabsContainer from '~/components/Tabs/Container'
import { Tabs } from '~/components/Tabs/Tabs'
import { DocumentTypes } from '~/types/credentials'
import { MainTabsParamList } from '../MainTabs'
import { ScreenNames } from '~/types/screens'

const TABS = [
  { id: DocumentTypes.document, value: strings.DOCUMENTS },
  { id: DocumentTypes.other, value: strings.OTHER },
]

const SUBTABS = [
  { id: 'type', value: strings.TYPE },
  { id: 'issuer', value: strings.ISSUER },
]

const DocumentTabs: React.FC = ({ children }) => {
  const route = useRoute<RouteProp<MainTabsParamList, ScreenNames.Documents>>()
  const initialTabId = route.params.initialTab ?? DocumentTypes.document
  const initialTab = TABS.find((t) => t.id === initialTabId)!

  return (
    <Tabs initialActiveTab={initialTab} initialActiveSubtab={SUBTABS[0]}>
      <TabsContainer customStyles={{ marginBottom: 10 }}>
        {TABS.map((t) => (
          <Tabs.Tab key={t.id} tab={t} />
        ))}
      </TabsContainer>

      <TabsContainer>
        {SUBTABS.map((st) => (
          <Tabs.Subtab key={st.id} tab={st} />
        ))}
      </TabsContainer>

      <Tabs.Panel>{() => children}</Tabs.Panel>
    </Tabs>
  )
}

export default DocumentTabs
