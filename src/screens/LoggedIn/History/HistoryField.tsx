import React from 'react'

import { View, Image } from 'react-native'
import JoloText from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { InitiatorPlaceholderIcon } from '~/assets/svg'

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

export const HistoryFieldPlaceholder = () => (
  <HistoryField type={'███████'} issuerName={'█████'} />
)

export default HistoryField
