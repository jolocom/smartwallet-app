import React, { useEffect, useMemo } from 'react'
import { SectionList, View, ViewToken } from 'react-native'
import Record, { useRecord } from './Record'

const RecordItemsList = ({ sectionGetter }) => {
  const {
    loadedInteractions,
    setNextPage,
    activeSection,
    setActiveSection,
  } = useRecord()

  const sections = useMemo(() => {
    return sectionGetter(loadedInteractions)
  }, [JSON.stringify(loadedInteractions)])

  useEffect(() => {
    setActiveSection(activeSection)
  }, [activeSection])

  const handleSectionChange = (items: ViewToken[]) => {
    const vToken = items[0]
    if (vToken && activeSection !== vToken.section.title) {
      setActiveSection(vToken.section.title)
    }
  }

  return (
    <SectionList
      sections={sections}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => 'id:' + item + i}
      overScrollMode={'never'}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={({ viewableItems }) =>
        handleSectionChange(viewableItems)
      }
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
      onEndReached={setNextPage}
      contentContainerStyle={{ marginTop: 32, paddingBottom: '40%' }}
      renderSectionHeader={() => <Record.Header />}
      renderSectionFooter={() => <View style={{ marginBottom: 36 }} />}
      renderItem={({ item, index }) => <Record.Item key={index} id={item} />}
    />
  )
}

export default RecordItemsList
