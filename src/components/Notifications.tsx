import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from './JoloText'

export enum NotificationType {
  Info = 'Info',
  Warning = 'Warning',
}

interface PropsI {
  title: string
  description: string
  type: NotificationType
  isInteractive?: boolean
  onInteract?: () => void
}

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const DESCRIPTIONS = [
  'You should have all you need to continue your interaction now, You should have all you need to continue your interaction now, You should have all you need to continue your interaction now, You should have all you need to continue your interaction now',
  'You should have all you need to continue your interaction now',
]
const NOTIFICATION_DETAILS = [
  {
    title: 'Great success!',
    description: DESCRIPTIONS[0],
    type: NotificationType.Info,
  },
  {
    title: 'Awkward',
    description: DESCRIPTIONS[1],
    type: NotificationType.Warning,
  },
]

const getRandomString = () => {
  return Math.random().toString(36).substring(7)
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

const Notification: React.FC<PropsI> = ({
  title,
  description,
  type,
  onInteract,
}) => {
  const { top } = useSafeArea()

  const containerTranslateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current
  const containerOpacity = containerTranslateY.interpolate({
    inputRange: [-300, -50, 0],
    outputRange: [0, 0, 1],
  })
  useEffect(() => {
    Animated.timing(containerTranslateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start()
  }, [])
  const animationStyles = {
    transform: [{ translateY: containerTranslateY }],
    opacity: containerOpacity,
  }

  const handleInteract = useCallback(() => {
    Animated.timing(containerTranslateY, {
      toValue: -300,
      useNativeDriver: true,
    }).start(() => {
      onInteract && onInteract()
    })
  }, [JSON.stringify(containerTranslateY)])
  return (
    <TouchableWithoutFeedback onPress={handleInteract}>
      <Animated.View
        style={[
          styles.notificationContainer,
          { paddingTop: top + 20 },
          animationStyles,
        ]}
      >
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.mini}
          color={type === NotificationType.Info ? Colors.white : Colors.error}
        >
          {title}
        </JoloText>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.tiniest}
          color={Colors.white}
        >
          {description}
        </JoloText>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default () => {
  const [notifications, setNotifications] = useState([
    { ...NOTIFICATION_DETAILS[0], id: getRandomString() },
  ])
  const handleInteract = (id: string) => {
    setNotifications([])
  }

  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications([
        {
          id: getRandomString(),
          ...NOTIFICATION_DETAILS[getRandomInt(2)],
        },
      ])
    }
  }, [notifications.length])

  return (
    <View style={styles.notifications}>
      {notifications.map((el) => (
        <Notification
          key={el.id}
          title={el.id + ' ' + el.title}
          description={el.description}
          type={el.type}
          onInteract={() => handleInteract(el.id)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  notifications: {
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    zIndex: 100,
  },
  notificationContainer: {
    backgroundColor: Colors.black,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
})
