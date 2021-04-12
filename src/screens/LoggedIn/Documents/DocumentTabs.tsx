import React from 'react'

import { strings } from '~/translations'
import TabsContainer from '~/components/Tabs/Container'
import { Tabs } from '~/components/Tabs/Tabs'
import { IWithCustomStyle } from '~/components/Card/types'
import { CredentialCategories } from '~/types/credentials'
import ScreenContainer from '~/components/ScreenContainer'

export const documentTabs = [
  { id: CredentialCategories.document, value: strings.DOCUMENTS },
  { id: CredentialCategories.other, value: strings.OTHER },
]

export const documentSubtabs = [
  { id: 'type', value: strings.TYPE },
  { id: 'issuer', value: strings.ISSUER },
]

const DocumentTabs: React.FC<IWithCustomStyle> = ({ children }) => {
  return (
    <Tabs
      initialActiveTab={documentTabs[0]}
      initialActiveSubtab={documentSubtabs[0]}
    >
      <ScreenContainer.Padding>
        <TabsContainer customStyles={{ marginBottom: 10 }}>
          {documentTabs.map((t) => (
            <Tabs.Tab key={t.id} tab={t} />
          ))}
        </TabsContainer>
      </ScreenContainer.Padding>

      <ScreenContainer.Padding>
        <TabsContainer>
          {documentSubtabs.map((st) => (
            <Tabs.Subtab key={st.id} tab={st} />
          ))}
        </TabsContainer>
      </ScreenContainer.Padding>

      <Tabs.Panel>{() => children}</Tabs.Panel>
    </Tabs>
  )
}

export default DocumentTabs
