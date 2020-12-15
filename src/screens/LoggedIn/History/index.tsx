import React, { useEffect, useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import HistoryTabs from '~/components/Tabs/HistoryTabs'
import useHistory, { IHistoryInteraction } from '~/hooks/history'
import { View, Image, FlatList, LayoutAnimation } from 'react-native'
import JoloText from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { IdentitySummary } from '@jolocom/sdk'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import { debugView } from '~/utils/dev'

const HistoryField: React.FC<{
  type: string
  issuerName: string
  image?: string
  time?: string
}> = React.memo(({ type, issuerName, time, image }) => {
  return (
    <View
      style={{
        height: 80,
        width: '100%',
        backgroundColor: Colors.black,
        borderRadius: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          marginHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {image ? (
          <Image
            style={{ width: 64, height: 64, borderRadius: 70 }}
            source={{ uri: image }}
          />
        ) : (
          <InitiatorPlaceholderIcon />
        )}
      </View>
      <View
        style={{
          flex: 0.8,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          height: '100%',
          paddingVertical: 18,
        }}
      >
        <JoloText>{type}</JoloText>
        <JoloText color={Colors.white35}>{issuerName}</JoloText>
      </View>
      <View
        style={{
          flex: 0.2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          height: '100%',
          paddingVertical: 18,
          marginRight: 16,
        }}
      >
        <JoloText>{time}</JoloText>
      </View>
    </View>
  )
})

const HistoryFieldPlaceholder = () => (
  <HistoryField type={'███████'} issuerName={'█████'} />
)

const HistoryInteraction: React.FC<{
  loadInteraction: (nonce: string) => Promise<IHistoryInteraction>
  id: string
}> = React.memo(({ loadInteraction, id }) => {
  const [
    interactionData,
    setInteractionData,
  ] = useState<IHistoryInteraction | null>(null)

  useEffect(() => {
    loadInteraction(id).then((interaction) => {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 500,
      })
      setInteractionData(interaction)
    })
  }, [])

  return interactionData ? (
    <HistoryField
      type={interactionData.type}
      issuerName={interactionData.issuer.publicProfile?.name ?? 'Unknown'}
      time={interactionData.time}
      image={interactionData.issuer.publicProfile?.image}
    />
  ) : (
    <HistoryFieldPlaceholder />
  )
})

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
