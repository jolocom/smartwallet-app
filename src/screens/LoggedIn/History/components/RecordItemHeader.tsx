import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

import { InitiatorPlaceholderIcon } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { IRecordDetails } from '~/types/records'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

const RecordItemHeader: React.FC<{ details: IRecordDetails | null }> = ({
  details,
}) => {
  const image = details?.issuer?.publicProfile?.image

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
            {details ? details.title : '███████'}
          </JoloText>

          <JoloText
            testID="record-item-time"
            size={JoloTextSizes.mini}
            color={Colors.white}
            customStyles={{ alignSelf: 'center', marginRight: 16 }}
          >
            {details ? details.time : '██'}
          </JoloText>
        </View>
        <JoloText size={JoloTextSizes.mini} color={Colors.white40}>
          {details ? details.issuer?.publicProfile?.name ?? 'Unknown' : '█████'}
        </JoloText>
      </View>
    </View>
  )
}
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

export default RecordItemHeader
