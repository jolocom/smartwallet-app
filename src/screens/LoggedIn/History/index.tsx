import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import HistoryTabs from '~/components/Tabs/HistoryTabs'
import useHistory from '~/hooks/history'
import { FlatList } from 'react-native'
import { HistoryFieldPlaceholder } from './HistoryField'
import HistoryInteraction from './HistoryInteraction'

const History: React.FC = () => {
  const { loadInteraction, loadedIds, loadPageIds } = useHistory()

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <HistoryTabs>
        {!loadedIds.length ? (
          new Array([1, 2, 3, 4, 5]).map(() => <HistoryFieldPlaceholder />)
        ) : (
          <FlatList
            data={loadedIds}
            onEndReachedThreshold={0.5}
            onEndReached={() => loadPageIds()}
            contentContainerStyle={{ paddingBottom: '40%' }}
            renderItem={({ item, index }) => (
              <HistoryInteraction
                key={index}
                id={item}
                loadInteraction={loadInteraction}
              />
            )}
          />
        )}
      </HistoryTabs>
    </ScreenContainer>
  )
}

export default History
