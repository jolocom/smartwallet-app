import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import { CredentialCategories } from '~/types/credentials'
import { strings } from '~/translations'
import Tabs from '~/components/Tabs/Tabs'
import TabsContainer from '~/components/Tabs/Container'
import { DocumentList } from './DocumentList'

const Documents: React.FC = () => {
  const tabs = [
    { id: CredentialCategories.document, value: strings.DOCUMENTS },
    { id: CredentialCategories.other, value: strings.OTHER },
  ]

  const subtabs = [
    { id: 'type', value: strings.TYPE },
    { id: 'issuer', value: strings.ISSUER },
  ]

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
      }}
    >
      <Tabs
        initialActiveTab={tabs[0]}
        initialActiveSubtab={subtabs[0]}
        tabs={tabs}
        subtabs={subtabs}
      >
        <ScreenContainer.Padding>
          <TabsContainer customStyles={{ marginBottom: 10 }}>
            {tabs.map((t) => (
              <Tabs.Tab key={t.id} tab={t} />
            ))}
          </TabsContainer>
        </ScreenContainer.Padding>

        <ScreenContainer.Padding>
          <TabsContainer>
            {subtabs.map((st) => (
              <Tabs.Subtab key={st.id} tab={st} />
            ))}
          </TabsContainer>
        </ScreenContainer.Padding>

        <Tabs.Panel>{() => <DocumentList />}</Tabs.Panel>
      </Tabs>
    </ScreenContainer>
  )
}

export default Documents
