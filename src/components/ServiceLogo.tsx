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
import LinearGradient from 'react-native-linear-gradient'

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

  return source ? (
    <View>
      <LinearGradient
        start={{ x: 1.0, y: 0.3 }}
        end={{ x: 1.0, y: 1.0 }}
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          borderWidth: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        colors={[Colors.azureRadiance, Colors.white]}
      >
        <TouchableOpacity
          onPress={serviceUrl && handleRedirectToCounterparty}
          activeOpacity={serviceUrl ? 0.9 : 1}
        >
          <Image style={styles.image} source={{ uri: source }} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  ) : (
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
