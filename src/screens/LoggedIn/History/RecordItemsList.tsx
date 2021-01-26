import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { SectionList, View, ViewToken } from 'react-native'

import { useTabs } from '~/components/Tabs/Tabs'
import { useHistory } from '~/hooks/history'
import { IPreLoadedInteraction } from '~/types/records'
import { groupBySection } from '~/hooks/history/utils'
import { useToasts } from '~/hooks/toasts'
import Record, { IRecordItemsListProps, useRecord } from './Record'
import RecordItem from './components/RecordItem'

const ITEMS_PER_PAGE = 5

const RecordItemsList: React.FC<IRecordItemsListProps> = ({
  flows,
  isActiveList,
}) => {
  const sectionListRef = useRef<SectionList | null>(null)
  const { updateActiveSection } = useRecord()

  const [activeSection, setActiveSection] = useState('')
  const [interactions, setInteractions] = useState<IPreLoadedInteraction[]>([])
  const [page, setPage] = useState(0)

  const { getInteractions: getInteractionTokens } = useHistory()
  const { scheduleErrorWarning } = useToasts()

  const { activeSubtab } = useTabs()

  useEffect(() => {
    if (activeSection && activeSubtab && isActiveList) {
      updateActiveSection(activeSubtab?.id, activeSection)
    }
  }, [activeSubtab?.id, activeSection])

  useEffect(() => {
    setNextPage()
  }, [])

  useEffect(() => {
    if (page) {
      getInteractionTokens(ITEMS_PER_PAGE, interactions.length, flows)
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

  const handleFocusItem = (index: number, section: string) => {
    const sectionIndex = sections.findIndex((s) => s.title === section)
    setTimeout(
      () =>
        sectionListRef.current?.scrollToLocation({
          sectionIndex,
          itemIndex: index,
          viewPosition: 0,
          animated: true,
        }),
      100,
    )
  }

  return (
    <SectionList<string>
      ref={sectionListRef}
      sections={sections}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => 'id:' + item + i}
      overScrollMode={'never'}
      onEndReachedThreshold={0.9}
      onViewableItemsChanged={handleSectionChange}
      onEndReached={handleEndReached}
      contentContainerStyle={{ marginTop: 32, paddingBottom: '100%' }}
      renderSectionHeader={({ section }) => (
        <Record.Header title={section.title} />
      )}
      renderSectionFooter={() => <View style={{ marginBottom: 36 }} />}
      renderItem={({ item, index, section }) => (
        <RecordItem
          key={index}
          id={item}
          onDropdown={() => handleFocusItem(index, section.title)}
        />
      )}
      stickySectionHeadersEnabled={false}
    />
  )
}

export default RecordItemsList
