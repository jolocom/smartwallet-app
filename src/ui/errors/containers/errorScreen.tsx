import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { JolocomButton, Wrapper } from '../../structure'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { debug } from '../../../styles/presets'
import { centeredText, fontMain } from '../../../styles/typography'
import { Colors } from '../../../styles'
import { BP } from '../../../styles/breakpoints'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.overflowBlack,
    justifyContent: 'space-between',
  },
  _placeholder: {
    marginTop: '15%',
    width: 200,
    height: 200,
    ...debug,
  },
  title: {
    marginTop: '7%',
    paddingHorizontal: 20,
    fontFamily: fontMain,
    fontSize: BP({
      small: 26,
      medium: 28,
      large: 28,
    }),
    color: Colors.sandLight090,
    ...centeredText,
  },
  message: {
    marginTop: 13,
    paddingHorizontal: 20,
    fontFamily: fontMain,
    fontSize: BP({
      small: 18,
      medium: 20,
      large: 20,
    }),
    color: Colors.sandLight080,
    lineHeight: 24,
    ...centeredText,
  },
  interactButton: {
    marginTop: 14,
    borderColor: 'white',
    borderWidth: 0.5,
  },
  buttonSection: {
    width: '100%',
    paddingBottom: 62,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  contentSection: {
    width: '100%',
    alignItems: 'center',
  },
})

enum ImageType {
  Red = 'red',
  Blue = 'blue',
}

export interface ErrorScreenParams {
  title: string
  message: string
  image?: ImageType
  interact?: {
    label: string
    onInteract: () => void | Promise<void>
  }
  dismiss: {
    label: string
    onDismiss: () => void | Promise<void>
  }
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, ErrorScreenParams>
}

export const ErrorScreenContainer: React.FC<Props> = props => {
  const {
    navigation: {
      state: {
        params: { title, message, interact, dismiss },
      },
    },
  } = props

  return (
    <Wrapper style={styles.wrapper}>
      <View style={styles.contentSection}>
        <View style={styles._placeholder} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.buttonSection}>
        <JolocomButton
          onPress={dismiss.onDismiss}
          transparent
          text={dismiss.label}
        />
        {interact && (
          <JolocomButton
            containerStyle={styles.interactButton}
            transparent
            onPress={interact.onInteract}
            text={interact.label}
          />
        )}
      </View>
    </Wrapper>
  )
}
