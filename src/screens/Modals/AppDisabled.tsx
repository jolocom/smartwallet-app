import React, { useMemo, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'

import AbsoluteBottom from '~/components/AbsoluteBottom'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import Space from '~/components/Space'
import { Colors } from '~/utils/colors'
import { Fonts, JoloTextSizes } from '~/utils/fonts'
import { ScreenNames } from '~/types/screens'
import { useBackHandler } from '@react-native-community/hooks'
import { GlobalModalsParamsList } from '~/RootNavigation'

const INITIAL_COUNTDOWN = 20 * 1
const LONG_COUNTDOWN = 60 * 5
const SHORT_COUNTDOWN = 60 * 1

// TODO: translation
// TODO: disable go back with hardware back btn
const AppDisabled = ({ navigation }) => {
  const { params } =
    useRoute<RouteProp<GlobalModalsParamsList, ScreenNames.AppDisabled>>()

  const { attemptCyclesLeft } = params

  console.log({ attemptCyclesLeft })

  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN)

  const isRestoreAccess = useMemo(
    () => !(attemptCyclesLeft > 0),
    [attemptCyclesLeft],
  )

  // countdown
  useEffect(() => {
    let countdownId: number | undefined
    const clearCountdown = (id: number | undefined) => {
      if (id) {
        clearInterval(id)
      }
    }
    if (attemptCyclesLeft > 0) {
      countdownId = setInterval(() => {
        setCountdown((prev) => --prev)
      }, 1000)
    } else {
      clearCountdown(countdownId)
    }
    return () => {
      clearCountdown(countdownId)
    }
  }, [attemptCyclesLeft])

  // enable app when the countdown expired
  useEffect(() => {
    if (countdown === 0) {
      if (attemptCyclesLeft && attemptCyclesLeft > 0) {
        navigation.goBack()
      }
    }
  }, [countdown, attemptCyclesLeft])

  const handleAccessRestore = () => {
    navigation.navigate(ScreenNames.PasscodeRecovery)
  }

  useBackHandler(() => true)

  return (
    <ScreenContainer backgroundColor={Colors.black65}>
      {!isRestoreAccess && (
        <View style={{ alignSelf: 'center', marginHorizontal: 25 }}>
          <JoloText
            kind={JoloTextKind.title}
            color={Colors.white85}
            customStyles={{ fontFamily: Fonts.Regular }}
          >
            Your wallet is disabled for security reasons
          </JoloText>
          <Space height={17} />
          <Text
            style={{
              color: Colors.white,
              fontSize: 18,
              lineHeight: 18,
              textAlign: 'center',
              fontFamily: Fonts.Regular,
            }}
          >
            Try again in{' '}
            <Text style={{ color: Colors.error }}>{countdown}</Text>
          </Text>
        </View>
      )}
      {isRestoreAccess && (
        <View style={{ alignSelf: 'center' }}>
          <JoloText
            kind={JoloTextKind.title}
            color={Colors.white85}
            customStyles={{
              marginHorizontal: 25,
              fontFamily: Fonts.Regular,
            }}
          >
            You have reached the limit of your attempts
          </JoloText>
        </View>
      )}
      {isRestoreAccess && (
        <AbsoluteBottom>
          <ScreenContainer.Padding>
            <BtnGroup>
              <Btn onPress={handleAccessRestore} type={BtnTypes.primary}>
                Restore Access
              </Btn>
              <Space height={12} />
              <JoloText
                size={JoloTextSizes.tiniest}
                customStyles={{ color: Colors.white70 }}
              >
                Setting a new passcode will not affect your stored data
              </JoloText>
            </BtnGroup>
          </ScreenContainer.Padding>
        </AbsoluteBottom>
      )}
    </ScreenContainer>
  )
}

export default AppDisabled
