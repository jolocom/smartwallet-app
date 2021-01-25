import { FlowType } from '@jolocom/sdk'
import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import TabsContainer from '~/components/Tabs/Container'
import Tabs from '~/components/Tabs/Tabs'
import { strings } from '~/translations'
import Record from './Record'

const SUBTABS = [
  { id: 'all', value: strings.ALL },
  { id: 'shared', value: strings.SHARED },
  { id: 'received', value: strings.RECEIVED },
]

export enum RecordTypes {
  all = 'all',
  shared = 'shared',
  received = 'received',
}

const History = () => {
  return (
    <ScreenContainer
      testID="history-screen"
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <Record>
        <Tabs initialActiveSubtab={SUBTABS[0]}>
          <Record.Header />
          <TabsContainer>
            {SUBTABS.map((st) => (
              <Tabs.Subtab key={st.id} tab={st} />
            ))}
          </TabsContainer>
          <Tabs.Panel>
            {({ activeSubtab }) => (
              <>
                <Tabs.PersistChildren
                  isContentVisible={activeSubtab?.id === 'all'}
                >
                  {/* ItemsList should have a param type: should be added once there is a
                    support for passing multiple interaction types to support all subtab usecase
                  */}
                  <Record.ItemsList isActiveList={activeSubtab?.id === 'all'} />
                </Tabs.PersistChildren>
                <Tabs.PersistChildren
                  isContentVisible={activeSubtab?.id === 'shared'}
                >
                  <Record.ItemsList
                    isActiveList={activeSubtab?.id === 'shared'}
                    flows={[FlowType.CredentialShare]}
                  />
                </Tabs.PersistChildren>
                <Tabs.PersistChildren
                  isContentVisible={activeSubtab?.id === 'received'}
                >
                  <Record.ItemsList
                    isActiveList={activeSubtab?.id === 'received'}
                    flows={[FlowType.CredentialOffer]}
                  />
                </Tabs.PersistChildren>
              </>
            )}
          </Tabs.Panel>
        </Tabs>
      </Record>
    </ScreenContainer>
  )
}

export default History
