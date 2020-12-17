import React from 'react'

import { View, Image, StyleSheet } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import { JoloTextSizes } from '~/utils/fonts'

const HistoryField: React.FC<{
  type: string
  issuerName?: string
  time: string
  image?: string
}> = React.memo(({ type, issuerName, time, image }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image style={styles.image} source={{ uri: image }} />
        ) : (
          <InitiatorPlaceholderIcon />
        )}
      </View>
      <View style={[styles.textContainer]}>
        <View style={styles.topContainer}>
          <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini}>
            {type}
          </JoloText>

          <JoloText
            size={JoloTextSizes.mini}
            color={Colors.white}
            customStyles={{ alignSelf: 'center', marginRight: 16 }}
          >
            {time}
          </JoloText>
        </View>
        <JoloText size={JoloTextSizes.mini} color={Colors.white40}>
          {issuerName ?? 'Unknown'}
        </JoloText>
      </View>
    </View>
  )
})

export const HistoryFieldPlaceholder = () => (
  <HistoryField type={'███████'} issuerName={'█████'} time={'██'} />
)

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    backgroundColor: Colors.black,
    borderRadius: 15,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 70,
  },
  textContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 18,
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
})

export default HistoryField
