import React, { useEffect, useState } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'

import { InitiatorPlaceholderIcon } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useHistory } from '~/hooks/history'
import { IRecordDetails } from '~/hooks/history/types'
import { useToasts } from '~/hooks/toasts'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { IRecordItemProps } from './Record'
import RecordDropdown from './RecordDropdown'

const RecordBlock: React.FC<{ details: IRecordDetails | null }> = ({
  details,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* TODO: seems there is not use case as of now where image is part of returned interaction details */}
        {/* {image && (
          <Image style={styles.image} source={{ uri: image }} />
        )} */}
        <InitiatorPlaceholderIcon />
      </View>
      <View style={[styles.textContainer]}>
        <View style={styles.topContainer}>
          <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini}>
            {details ? details.type : '███████'}
          </JoloText>

          <JoloText
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

const RecordItem: React.FC<IRecordItemProps> = ({ id }) => {
  const [itemDetails, setItemDetails] = useState<IRecordDetails | null>(null)
  const [isOpen, setOpen] = useState(false)

  const { scheduleErrorWarning } = useToasts()
  const { getInteractionDetails } = useHistory()

  const handlePress = () => {
    if (itemDetails) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })
      setOpen((prev) => !prev)
    }
  }

  useEffect(() => {
    getInteractionDetails(id)
      .then((details) => {
        return details
      })
      .then((interaction) => {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: 500,
        })
        setItemDetails(interaction)
      })
      .catch(scheduleErrorWarning)
  }, [])

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <RecordBlock details={itemDetails} />
      {isOpen && itemDetails && <RecordDropdown details={itemDetails} />}
    </TouchableOpacity>
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

export default RecordItem
