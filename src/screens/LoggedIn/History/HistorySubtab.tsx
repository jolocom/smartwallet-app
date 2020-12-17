import React, { useState, useEffect } from 'react'
import { View, SectionList, ViewToken } from 'react-native'

import { IHistorySection, IInteractionDetails } from '~/hooks/history/types'
import HistoryInteraction from './HistoryInteraction'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

interface Props {
  sections: IHistorySection[]
  loadSections: () => void
  getInteractionDetails: (id: string) => Promise<IInteractionDetails>
  onSectionChange?: (section: string) => void
}

const HistorySubtab: React.FC<Props> = React.memo(
  ({ sections, loadSections, getInteractionDetails, onSectionChange }) => {
    const [activeSection, setActiveSection] = useState('')
    const isEmpty = !sections.length

    useEffect(() => {
      onSectionChange && onSectionChange(activeSection)
    }, [activeSection])

    const handleSectionChange = (items: ViewToken[]) => {
      const vToken = items[0]
      if (vToken && activeSection !== vToken.section) {
        setActiveSection(vToken.section.section)
      }
    }

    if (!isEmpty) {
      console.log(sections)
    }
    return isEmpty ? null : (
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
        onEndReached={loadSections}
        contentContainerStyle={{ marginTop: 32, paddingBottom: '40%' }}
        renderSectionHeader={({ section }) => (
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.middle}
            color={Colors.white85}
            customStyles={{
              textAlign: 'left',
              marginBottom: 20,
            }}
          >
            {section.section}
          </JoloText>
        )}
        renderSectionFooter={() => <View style={{ marginBottom: 36 }} />}
        renderItem={({ item, index }) => (
          <HistoryInteraction
            key={index}
            id={item}
            getInteractionDetails={getInteractionDetails}
          />
        )}
      />
    )
  },
)

export default HistorySubtab
