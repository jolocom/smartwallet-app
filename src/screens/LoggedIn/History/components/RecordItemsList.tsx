import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SectionList, View, ViewToken } from 'react-native'
import { useHistory } from '~/hooks/history'
import { IPreLoadedInteraction } from '~/hooks/history/types'
import { groupBySection } from '~/hooks/history/utils'
import { useToasts } from '~/hooks/toasts'
import Record, { IRecordItemsListProps, useRecord } from './Record'

/* This name is misleading, it rather say us TOKENS_PER_BATCH */
const ITEMS_PER_PAGE = 4

const RecordItemsList: React.FC<IRecordItemsListProps> = ({ type }) => {
  const { activeSection, setActiveSection } = useRecord()
  const [interactions, setInteractions] = useState<IPreLoadedInteraction[]>([])
  const [page, setPage] = useState(0)

  const { getInteractions: getInteractionTokens } = useHistory()
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    setNextPage()
  }, [])

  useEffect(() => {
    /* TODO: an issue is that is doesn't take ITEMS_PER_PAGE
      as distinct tokens, it actually takes all, even duplicate tokens,
      so there is no match between how many items you see and 
      ITEMS_PER_PAGE 
    */
    if (page) {
      getInteractionTokens(ITEMS_PER_PAGE, interactions.length, type)
        .then((tokens) => {
          setInteractions((prevState) => [...prevState, ...tokens])
        })
        .catch((e) => {
          console.log('An error occured while fetching Record list items', e)
          scheduleErrorWarning(e)
        })
    }
  }, [page])

  const sections = useMemo(() => {
    return groupBySection(interactions)
  }, [JSON.stringify(interactions)])

  const setNextPage = useCallback(() => {
    setPage((prevPage) => ++prevPage)
  }, [])

  const handleSectionChange = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const vToken = viewableItems[0]
      if (vToken && activeSection !== vToken.section.title) {
        setActiveSection(vToken.section.title)
      }
    },
    [activeSection],
  )

  /* Preventing onEndReached cb be called infinitely if there are 
    little of interaction records
  */
  const handleEndReached = useCallback(() => {
    if (ITEMS_PER_PAGE * page === interactions.length) {
      setNextPage()
    }
  }, [page, JSON.stringify(interactions)])

  return (
    <SectionList
      sections={sections}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => 'id:' + item + i}
      overScrollMode={'never'}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={handleSectionChange}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
      onEndReached={handleEndReached}
      contentContainerStyle={{ marginTop: 32, paddingBottom: '40%' }}
      renderSectionHeader={({ section }) => (
        <Record.Header title={section.title} />
      )}
      renderSectionFooter={() => <View style={{ marginBottom: 36 }} />}
      renderItem={({ item, index }) => <Record.Item key={index} id={item} />}
      stickySectionHeadersEnabled={false}
    />
  )
}

export default RecordItemsList
