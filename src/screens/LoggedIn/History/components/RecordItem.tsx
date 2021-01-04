import React, { useEffect, useState } from 'react';
import { Image, LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import { IdentitySummary, FlowType } from 'react-native-jolocom'

import { InitiatorPlaceholderIcon } from '~/assets/svg';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import { useHistory } from '~/hooks/history';
import { useToasts } from '~/hooks/toasts';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';
import { IRecordItemProps } from './Record';

export interface IInteractionDetails {
  type: FlowType
  issuer: IdentitySummary
  time: string
}

const RecordItem: React.FC<IRecordItemProps> = ({ id }) => {

  const [itemDetails, setItemDetails] = useState<IInteractionDetails | null>(null);

  const { scheduleErrorWarning } = useToasts()
  const { getInteractionDetails } = useHistory()

  useEffect(() => {
    getInteractionDetails(id)
      .then((interaction) => {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: 500,
        })
        setItemDetails(interaction)
      })
      .catch(scheduleErrorWarning)
  }, [])


  if (!itemDetails) {
    return (
      <Text>Placeholder...</Text>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {itemDetails.image ? (
          <Image style={styles.image} source={{ uri: itemDetails.image }} />
        ) : (
            <InitiatorPlaceholderIcon />
          )}
      </View>
      <View style={[styles.textContainer]}>
        <View style={styles.topContainer}>
          <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini}>
            {itemDetails.type}
          </JoloText>

          <JoloText
            size={JoloTextSizes.mini}
            color={Colors.white}
            customStyles={{ alignSelf: 'center', marginRight: 16 }}
          >
            {itemDetails.time}
          </JoloText>
        </View>
        <JoloText size={JoloTextSizes.mini} color={Colors.white40}>
          {itemDetails.issuerName ?? 'Unknown'}
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

export default RecordItem;