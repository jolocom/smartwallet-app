import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { SectionList, View, ViewToken } from 'react-native'

import { useTabs } from '~/components/Tabs/context'
import { useHistory } from '~/hooks/history'
import { IPreLoadedInteraction } from '~/types/records'
import { groupBySection } from '~/hooks/history/utils'
import { useToasts } from '~/hooks/toasts'
import { IRecordItemsListProps } from './types'
import { useRecord } from './context'
import RecordItem from './components/RecordItem'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { strings } from '~/translations'
import RecordHeader from './RecordHeader'

const ITEMS_PER_PAGE = 5

const RecordItemsList: React.FC<IRecordItemsListProps> = ({ id, flows }) => {
  const sectionListRef = useRef<SectionList | null>(null)
  const { updateActiveSection } = useRecord()

  const [activeSection, setActiveSection] = useState('')
  const [interactions, setInteractions] = useState<IPreLoadedInteraction[]>([])
  const [page, setPage] = useState(0)
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  const { getInteractions: getInteractionTokens } = useHistory()
  const { scheduleErrorWarning } = useToasts()

  const { activeSubtab } = useTabs()

  useEffect(() => {
    if (activeSection && activeSubtab && activeSubtab.id === id) {
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

  const handleFocusItem = (id: string, index: number, section: string) => {
    const isFocused = focusedItem === id
    setFocusedItem(isFocused ? null : id)

    if (!isFocused) {
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
  }

  return sections.length ? (
    <SectionList<string>
      testID={`record-list-${id}`}
      ref={sectionListRef}
      sections={sections}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => 'id:' + item + i}
      overScrollMode={'never'}
      onEndReachedThreshold={0.9}
      onViewableItemsChanged={handleSectionChange}
      onEndReached={handleEndReached}
      contentContainerStyle={{ marginTop: 32, paddingBottom: 100 }}
      renderSectionHeader={({ section }) => {
        if (section.title === sections[0].title) return null
        return <RecordHeader title={section.title} />
      }}
      renderSectionFooter={() => <View style={{ marginBottom: 36 }} />}
      renderItem={({ item, index, section }) => (
        <RecordItem
          key={index}
          isFocused={focusedItem === item}
          id={item}
          onDropdown={() => handleFocusItem(item, index, section.title)}
        />
      )}
      stickySectionHeadersEnabled={false}
    />
  ) : (
    <ScreenPlaceholder
      title={strings.NO_HISTORY_YET}
      description={
        strings.YOU_DONT_HAVE_ANY_COMPLETED_INTERACTIIONS_YET_MAKE_ONE_TODAY
      }
    />
  )
}

export default RecordItemsList
