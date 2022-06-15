import React from 'react'
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { useToasts } from '~/hooks/toasts'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import { Colors } from '~/utils/colors'

interface Props {
  source?: string
  serviceUrl?: string
}

export const ServiceLogo: React.FC<Props> = ({ source, serviceUrl }) => {
  const { scheduleErrorWarning } = useToasts()

  const handleRedirectToCounterparty = async () => {
    if (serviceUrl) {
      try {
        await Linking.openURL(serviceUrl)
      } catch (e) {
        scheduleErrorWarning(e as Error)
      }
    }
  }

  if (source) {
    return (
      <TouchableOpacity
        onPress={handleRedirectToCounterparty}
        activeOpacity={0.9}
      >
        <Image style={styles.image} source={{ uri: source }} />
      </TouchableOpacity>
    )
  }
  return (
    <View style={[styles.image, { backgroundColor: Colors.white }]}>
      <InitiatorPlaceholderIcon />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
})
