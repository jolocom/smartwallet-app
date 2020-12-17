import React, { useState } from 'react'
import { View, ActivityIndicator } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import useHistory from '~/hooks/history'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import Tabs from '~/components/Tabs/Tabs'
import TabsContainer from '~/components/Tabs/Container'
import { strings } from '~/translations'
import HistorySubtab from './HistorySubtab'

const SUBTABS = [
  { id: 'all', value: strings.ALL },
  { id: 'shared', value: strings.SHARED },
  { id: 'received', value: strings.RECEIVED },
]

const History: React.FC = () => {
  const {
    getInteractionDetails,
    setNextPage,
    groupedInteractions,
    groupedReceiveInteractions,
    groupedShareInteractions,
    isLoading,
  } = useHistory()
  const [activeSection, setActiveSection] = useState('')

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        customStyles={{ textAlign: 'left', marginBottom: 22, width: '100%' }}
      >
        {activeSection}
      </JoloText>
      <Tabs initialActiveSubtab={SUBTABS[0]}>
        <TabsContainer>
          {SUBTABS.map((st) => (
            <Tabs.Subtab key={st.id} tab={st} />
          ))}
        </TabsContainer>
        <Tabs.Panel>
          {({ activeSubtab }) => (
            <>
              {isLoading && <ActivityIndicator style={{ marginTop: '50%' }} />}
              <View
                style={{
                  display: activeSubtab?.id === 'all' ? 'flex' : 'none',
                }}
              >
                <HistorySubtab
                  sections={groupedInteractions}
                  loadSections={setNextPage}
                  getInteractionDetails={getInteractionDetails}
                  onSectionChange={setActiveSection}
                />
              </View>
              <View
                style={{
                  display: activeSubtab?.id === 'shared' ? 'flex' : 'none',
                }}
              >
                <HistorySubtab
                  sections={groupedShareInteractions}
                  loadSections={setNextPage}
                  getInteractionDetails={getInteractionDetails}
                  onSectionChange={setActiveSection}
                />
              </View>
              <View
                style={{
                  display: activeSubtab?.id === 'received' ? 'flex' : 'none',
                }}
              >
                <HistorySubtab
                  sections={groupedReceiveInteractions}
                  loadSections={setNextPage}
                  getInteractionDetails={getInteractionDetails}
                  onSectionChange={setActiveSection}
                />
              </View>
            </>
          )}
        </Tabs.Panel>
      </Tabs>
    </ScreenContainer>
  )
}

export default History
