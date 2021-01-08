import React from 'react'
import { strings } from '~/translations'
import TabsContainer from '~/components/Tabs/Container'
import { Tabs } from '~/components/Tabs/Tabs'
import { DocumentTypes } from '~/types/credentials'

const TABS = [
  { id: DocumentTypes.document, value: strings.DOCUMENTS },
  { id: DocumentTypes.other, value: strings.OTHER },
]

const SUBTABS = [
  { id: 'type', value: strings.TYPE },
  { id: 'issuer', value: strings.ISSUER },
]

const DocumentTabs: React.FC = ({ children }) => {
  return (
    <Tabs initialActiveTab={TABS[0]} initialActiveSubtab={SUBTABS[0]}>
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
