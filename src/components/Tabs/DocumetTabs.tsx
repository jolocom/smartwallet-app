import React from 'react'
import { strings } from '~/translations'
import TabsContainer from './Container'
import Tabs from './Tabs'

const DocumentTabs: React.FC = ({ children }) => {
  return (
    <Tabs
      initialActiveTab={strings.DOCUMENTS}
      initialActiveSubtab={strings.TYPE}
    >
      <TabsContainer customStyles={{ marginBottom: 10 }}>
        <Tabs.Tab>{strings.DOCUMENTS}</Tabs.Tab>
        <Tabs.Tab>{strings.OTHER}</Tabs.Tab>
      </TabsContainer>

      <TabsContainer>
        <Tabs.Subtab>{strings.TYPE}</Tabs.Subtab>
        <Tabs.Subtab>{strings.ISSUER}</Tabs.Subtab>
      </TabsContainer>

      <Tabs.Panel>{children}</Tabs.Panel>
    </Tabs>
  )
}

export default DocumentTabs
