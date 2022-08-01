import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Tabs from '~/components/Tabs/Tabs'
import TabsContainer from '~/components/Tabs/Container'
import { DocumentList } from './DocumentList'
import useTranslation from '~/hooks/useTranslation'

const Documents: React.FC = () => {
  const { t } = useTranslation()
  const tabs = [{ id: 'documents', value: t('Documents.documentsTab') }]

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
      }}
    >
      <Tabs initialActiveTab={tabs[0]} tabs={tabs}>
        <ScreenContainer.Padding>
          <TabsContainer customStyles={{ marginBottom: 10 }}>
            {tabs.map((t) => (
              <Tabs.Tab key={t.id} tab={t} />
            ))}
          </TabsContainer>
        </ScreenContainer.Padding>
        <Tabs.Panel>{() => <DocumentList />}</Tabs.Panel>
      </Tabs>
    </ScreenContainer>
  )
}

export default Documents
