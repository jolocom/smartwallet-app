import React from 'react'

import { strings } from '~/translations'
import TabsContainer from '~/components/Tabs/Container'
import { Tabs } from '~/components/Tabs/Tabs'
import { CredentialCategories } from '~/types/credentials'

export const documentTabs = [
  { id: CredentialCategories.document, value: strings.DOCUMENTS },
  { id: CredentialCategories.other, value: strings.OTHER },
]

export const documentSubtabs = [
  { id: 'type', value: strings.TYPE },
  { id: 'issuer', value: strings.ISSUER },
]

const DocumentTabs: React.FC = ({ children }) => {
  return (
    <Tabs
      initialActiveTab={documentTabs[0]}
      initialActiveSubtab={documentSubtabs[0]}
    >
      <TabsContainer customStyles={{ marginBottom: 10 }}>
        {documentTabs.map((t) => (
          <Tabs.Tab key={t.id} tab={t} />
        ))}
      </TabsContainer>

      <TabsContainer>
        {documentSubtabs.map((st) => (
          <Tabs.Subtab key={st.id} tab={st} />
        ))}
      </TabsContainer>

      <Tabs.Panel>{() => children}</Tabs.Panel>
    </Tabs>
  )
}

export default DocumentTabs
