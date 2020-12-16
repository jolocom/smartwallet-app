import React from 'react'
import { View, SectionList } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import HistoryTabs from '~/components/Tabs/HistoryTabs'
import useHistory from '~/hooks/history'
import { HistoryFieldPlaceholder } from './HistoryField'
import HistoryInteraction from './HistoryInteraction'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

const History: React.FC = () => {
  const {
    getInteractionDetails,
    loadSections,
    groupedInteractions,
  } = useHistory()
  console.log({ groupedInteractions })
  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <HistoryTabs>
        {!groupedInteractions.length ? (
          <View style={{ marginTop: 32 }}>
            {new Array([1, 2, 3, 4, 5]).map(() => (
              <HistoryFieldPlaceholder />
            ))}
          </View>
        ) : (
          <SectionList
            sections={groupedInteractions}
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            onEndReachedThreshold={0.5}
            onEndReached={() => loadSections()}
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
        )}
      </HistoryTabs>
    </ScreenContainer>
  )
}

export default History
