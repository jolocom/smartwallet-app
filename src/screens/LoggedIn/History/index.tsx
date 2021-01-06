import { FlowType } from '@jolocom/sdk'
import React, { useCallback } from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import TabsContainer from '~/components/Tabs/Container'
import Tabs from '~/components/Tabs/Tabs'
import { IPreLoadedInteraction } from '~/hooks/history/types'
import { groupBySection } from '~/hooks/history/utils'
import { strings } from '~/translations'
import Record from './components/Record'

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
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
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
                  <Record.ItemsList />
                </Tabs.PersistChildren>
                {/* <Tabs.PersistChildren
                  isContentVisible={activeSubtab?.id === 'shared'}
                >
                  <Record.ItemsList />
                </Tabs.PersistChildren>
                <Tabs.PersistChildren
                  isContentVisible={activeSubtab?.id === 'received'}
                >
                  <Record.ItemsList />
                </Tabs.PersistChildren> */}
              </>
            )}
          </Tabs.Panel>
        </Tabs>
      </Record>
    </ScreenContainer>
  )
}

export default History

/*
  <Record>
    <Tabs>
      <Tabs.Panel>
      {({activeSubtab}) => (
          <Record.Header /> // activeSubtab + activeSection
          <Tabs.Subtabs />
          <Record.ItemsList type={all}    />
          <Record.ItemsList type={shared} />
          <Record.ItemsList type={received} />
          )}
      </Tabs.Panel>
    </Tabs>
  </Record>
*/
