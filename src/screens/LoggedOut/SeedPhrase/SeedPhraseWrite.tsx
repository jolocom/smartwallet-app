import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native'
// @ts-ignore no typescript support as of yet
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import Btn, { BtnTypes } from '~/components/Btn'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { strings } from '~/translations/strings'
import useCircleHoldAnimation, { GestureState } from './useCircleHoldAnimation'
import { useStoredMnemonic } from '~/hooks/sdk'
import { InfoIcon } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import MagicButton from '~/components/MagicButton'
import WordPill from './components/WordPill'
import SeedPhrase from './components/Styled'

const vibrationOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

const SeedPhraseWrite: React.FC = () => {
  const redirect = useRedirect()
  const { gestureState,
    animationValues: { shadowScale, circleScale, magicOpacity },
    animateVaues: { hideMagicBtn },
    gestureHandlers,
  } = useCircleHoldAnimation(1200)

  const [showInfo, setShowInfo] = useState(true)
  const [seedphrase, setSeedphrase] = useState('')
  const getMnemonic = useStoredMnemonic()

  const infoOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(0)).current

  const phraseOpacity = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

  useEffect(() => {
    getMnemonic().then(setSeedphrase)
  }, [])

  useEffect(() => {
    switch (gestureState) {
      case GestureState.Start:
        setShowInfo(false)
        break
      case GestureState.End:
        setShowInfo(true)
        break
      case GestureState.Success:
        ReactNativeHapticFeedback.trigger('impactLight', vibrationOptions)
        Animated.parallel([
          hideMagicBtn,
          Animated.timing(buttonOpacity, {
            duration: 200,
            useNativeDriver: true,
            toValue: 1,
          }),
        ]).start()
        break
      default:
        break
    }
  }, [gestureState])

  useEffect(() => {
    Animated.timing(infoOpacity, {
      duration: 200,
      useNativeDriver: true,
      toValue: showInfo ? 1 : 0,
    }).start()
  }, [showInfo])

  const initialBackgroundOpacity = shadowScale.interpolate({
    inputRange: [0.85, 1],
    outputRange: [1, 0],
  })

  const shadowAnimation = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

  const renderBackgroundCrossfade = () => (
    <>
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: Colors.mainBlack,
          },
        ]}
      />
      {gestureState !== GestureState.Success && (
        <Animated.View
          style={[
            styles.wrapper,
            {
              backgroundColor: Colors.black,
              opacity: initialBackgroundOpacity,
            },
          ]}
        />
      )}
    </>
  )

  const renderInfoIcon = () => (
    <Animated.View style={[styles.iconContainer, { opacity: buttonOpacity }]}>
      <TouchableOpacity onPress={() => redirect(ScreenNames.SeedPhraseInfo)}>
        <InfoIcon />
      </TouchableOpacity>
    </Animated.View>
  )

  const renderSeedphrase = () => {
    return (
      <Animated.View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', opacity: gestureState === GestureState.Success ? 1 : phraseOpacity }}>
        {
          seedphrase.split(' ').map(w => (
            // TODO: shadows are missing
            <WordPill key={w}>{w}</WordPill>
          ))
        }
      </Animated.View>
    )
  }

  const renderMagicButton = () => (
    <MagicButton
      gestureHandlers={gestureHandlers}
      animatedValues={{ shadowScale, circleScale, magicOpacity }}
    />
  )

  const renderMagicInfo = () => (
    <Animated.View style={[styles.info, { opacity: infoOpacity }]}>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white70}
        customStyles={{ opacity: 0.7 }}
      >
        {strings.HOLD_YOUR_FINGER_ON_THE_CIRCLE}
      </JoloText>
    </Animated.View>
  )

  const renderCTABtn = () => (
    <Animated.View style={{ opacity: buttonOpacity }}>
      <Btn
        type={BtnTypes.primary}
        onPress={
          gestureState === GestureState.Success
            ? () => redirect(ScreenNames.SeedPhraseRepeat)
            : () => { }
        }
      >
        {strings.DONE}
      </Btn>
    </Animated.View>
  )

  return (
    <>
      {renderBackgroundCrossfade()}
      <SeedPhrase.Styled.ScreenContainer>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <SeedPhrase.Styled.HelperText>
            {strings.WRITE_DOWN_THIS_PHRASE_SOMEWHERE_SAFE}
          </SeedPhrase.Styled.HelperText>
        </Animated.View>
        <SeedPhrase.Styled.ActiveArea>
          {/* this should take 3/5 of a screen; justify-content: space-between */}
          <View style={styles.phraseContainer}>
            {/* TODO: move info icon in the header */}
            {/* {renderInfoIcon()} */}
            {renderSeedphrase()}
          </View>
          {/* this should take 2/5 of a screen */}
          <View style={styles.helpersContainer}>
            <View style={styles.bottomContainer}>
              <View style={styles.nestedInBottomContainer}>
                {renderMagicButton()}
                {renderMagicInfo()}
              </View>
            </View>
          </View>
        </SeedPhrase.Styled.ActiveArea>
        <SeedPhrase.Styled.CTA>
          {renderCTABtn()}
        </SeedPhrase.Styled.CTA>
      </SeedPhrase.Styled.ScreenContainer>
    </>
  )
}

const styles = StyleSheet.create({
  phraseContainer: {
    flex: 0.6,
    width: '100%',
  },
  helpersContainer: {
    flex: 0.4,
    width: '100%',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    alignSelf: 'flex-end',
  },
  info: {
    width: '40%',
    marginTop: 20,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bottomContainer: {
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  nestedInBottomContainer: {
    alignItems: 'center',
  },
  gradient: {
    width: 160,
    height: 160,
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.black,
    borderColor: Colors.success,
    borderWidth: Platform.select({
      ios: 1,
      android: 0.5,
    }),
    zIndex: 20,
  },
})

export default SeedPhraseWrite
