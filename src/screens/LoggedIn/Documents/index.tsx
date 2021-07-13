import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import { CredentialCategories } from '~/types/credentials'
import Tabs from '~/components/Tabs/Tabs'
import TabsContainer from '~/components/Tabs/Container'
import { DocumentList } from './DocumentList'
import useTranslation from '~/hooks/useTranslation'

const Documents: React.FC = () => {
  const { t } = useTranslation()
  const tabs = [
    { id: CredentialCategories.document, value: t('Documents.documentsTab') },
    { id: CredentialCategories.other, value: t('Documents.othersTab') },
  ]

  const subtabs = [
    { id: 'type', value: t('Documents.typeSubtab') },
    { id: 'issuer', value: t('Documents.issuerSubtab') },
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
