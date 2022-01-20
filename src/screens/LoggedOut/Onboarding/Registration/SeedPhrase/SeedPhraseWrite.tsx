import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Animated, Platform } from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import Btn, { BtnTypes } from '~/components/Btn'
import {
  useDangerouslyDisableGestures,
  useGoBack,
  useRedirect,
} from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import useCircleHoldAnimation, { GestureState } from './useCircleHoldAnimation'
import { InfoIcon } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import MagicButton from '~/components/MagicButton'
import WordPill from './components/WordPill'
import SeedPhrase from './components/Styled'
import { useGetMnemonicPhrase } from '~/hooks/sdk'
import useTranslation from '~/hooks/useTranslation'
import { useDisableScreenshots } from '~/hooks/screenshots'

const vibrationOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

const SeedPhraseWrite: React.FC = () => {
  const { t } = useTranslation()
  const redirect = useRedirect()
  const goBack = useGoBack()
  const {
    gestureState,
    animationValues: { shadowScale, circleScale, magicOpacity },
    animateVaues: { hideMagicBtn },
    gestureHandlers,
  } = useCircleHoldAnimation(1200)

  const [showInfo, setShowInfo] = useState(true)
  const mnemonicPhrase = useGetMnemonicPhrase()

  useDangerouslyDisableGestures()

  useDisableScreenshots()

  const infoOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const buttonOpacity = useRef<Animated.Value>(new Animated.Value(0)).current

  const phraseOpacity = shadowScale.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  })

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

  const renderSeedphrase = () => (
    <Animated.View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        opacity: gestureState === GestureState.Success ? 1 : phraseOpacity,
      }}
    >
      {mnemonicPhrase.split(' ').map((w) => (
        <WordPill.Write key={w}>{w}</WordPill.Write>
      ))}
    </Animated.View>
  )

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
        {t('SeedphraseWrite.touchInstructions')}
      </JoloText>
    </Animated.View>
  )

  const renderCTABtn = () => (
    <Animated.View style={{ opacity: buttonOpacity }}>
      <Btn
        type={BtnTypes.primary}
        disabled={gestureState !== GestureState.Success}
        onPress={() => {
          if (gestureState === GestureState.Success) {
            redirect(ScreenNames.SeedPhraseRepeat)
          }
        }}
      >
        {t('SeedphraseWrite.confirmBtn')}
      </Btn>
      <Btn
        type={BtnTypes.secondary}
        onPress={goBack}
        disabled={gestureState !== GestureState.Success}
      >
        {t('SeedphraseWrite.exitBtn')}
      </Btn>
    </Animated.View>
  )

  return (
    <>
      {renderBackgroundCrossfade()}
      <SeedPhrase.Styled.ScreenContainer>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <SeedPhrase.Styled.Header>
            <SeedPhrase.Styled.Header.Right
              onPress={() =>
                redirect(ScreenNames.GlobalModals, {
                  screen: ScreenNames.SeedPhraseInfo,
                })
              }
            >
              <InfoIcon />
            </SeedPhrase.Styled.Header.Right>
          </SeedPhrase.Styled.Header>
        </Animated.View>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <SeedPhrase.Styled.HelperText>
            {t('SeedphraseWrite.writeInstructions')}
          </SeedPhrase.Styled.HelperText>
        </Animated.View>
        <SeedPhrase.Styled.ActiveArea>
          {/* this should take 3/5 of a screen; justify-content: space-between */}
          <View style={styles.phraseContainer}>{renderSeedphrase()}</View>
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
        <SeedPhrase.Styled.CTA>{renderCTABtn()}</SeedPhrase.Styled.CTA>
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
