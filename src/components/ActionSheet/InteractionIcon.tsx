import React from 'react'
import {
  View,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native'
import { Colors } from '~/utils/colors'
import { InitiatorPlaceholderIcon } from '~/assets/svg'

interface Props {
  icon: string | undefined
  redirectUrl: string | undefined
}

const InteractionIcon: React.FC<Props> = ({ icon, redirectUrl }) => {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => {
        redirectUrl &&
          Linking.canOpenURL(redirectUrl).then(
            (can) => can && Linking.openURL(redirectUrl),
          )
      }}
      activeOpacity={redirectUrl ? 0.8 : 1}
    >
      {icon ? (
        <Image style={styles.image} source={{ uri: icon }} />
      ) : (
        <View pointerEvents="none">
          <InitiatorPlaceholderIcon />
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 35,
    backgroundColor: Colors.white,
    width: 70,
    height: 70,
    position: 'absolute',
    top: 35,
    zIndex: 2,
  },
  image: {
    width: 70,
    height: 70,
  },
})

export default InteractionIcon
