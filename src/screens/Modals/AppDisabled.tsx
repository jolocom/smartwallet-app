import React, { useMemo, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useBackHandler } from '@react-native-community/hooks'
import moment from 'moment'

import AbsoluteBottom from '~/components/AbsoluteBottom'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import Space from '~/components/Space'
import { Colors } from '~/utils/colors'
import { Fonts, JoloTextSizes } from '~/utils/fonts'
import { ScreenNames } from '~/types/screens'
import { GlobalModalsParamsList } from '~/RootNavigation'
import useTranslation from '~/hooks/useTranslation'
import useSettings, { SettingKeys } from '~/hooks/settings'

// TODO: update the value to commented out
// const LONG_COUNTDOWN = 60 * 5
const LONG_COUNTDOWN = 20 * 5
// const SHORT_COUNTDOWN = 60 * 1
const SHORT_COUNTDOWN = 20 * 1

// TODO: translation
// TODO: disable go back with hardware back btn
const AppDisabled = ({ navigation }) => {
  const { params } =
    useRoute<RouteProp<GlobalModalsParamsList, ScreenNames.AppDisabled>>()

  const { attemptCyclesLeft, countdown: storedCountdown } = params
  const { t } = useTranslation()

  const settings = useSettings()
  const storeLastCountdown = async (value: number) =>
    settings.set(SettingKeys.countdown, { value })

  const getInitialCountdownValue = () => {
    if (attemptCyclesLeft !== undefined) {
      if (storedCountdown !== 0) {
        return storedCountdown
      } else if (attemptCyclesLeft === 2) {
        return SHORT_COUNTDOWN
      } else if (attemptCyclesLeft === 1) {
        return LONG_COUNTDOWN
      }
    }
    return SHORT_COUNTDOWN
  }
  const [countdown, setCountdown] = useState(getInitialCountdownValue)
  const [startStoreCountdown, setStoreCountdown] = useState(false)

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

  /**
   * every 10 sec store countdown value
   */
  useEffect(() => {
    if (countdown % 10 === 0) {
      setStoreCountdown(true)
    }
  }, [countdown])

  /**
   * store countdown value
   */
  useEffect(() => {
    if (startStoreCountdown) {
      ;(async () => {
        await storeLastCountdown(countdown)
        setStoreCountdown(false)
      })()
    }
  }, [startStoreCountdown, countdown])

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

  const formattedCountdown = useMemo(() => {
    const duration = moment.duration(countdown * 1000, 'milliseconds')
    const minutes = duration.minutes()
    const seconds = duration.seconds()
    const lengthMins = minutes.toString().length
    const lengthSecs = seconds.toString().length
    return `${lengthMins > 1 ? minutes : '0' + minutes}:${
      lengthSecs > 1 ? seconds : '0' + seconds
    }`
  }, [countdown])

  return (
    <ScreenContainer backgroundColor={Colors.black65}>
      {!isRestoreAccess && (
        <View style={{ alignSelf: 'center', marginHorizontal: 25 }}>
          <JoloText
            kind={JoloTextKind.title}
            color={Colors.white85}
            customStyles={{ fontFamily: Fonts.Regular }}
          >
            {t('DisableOverlay.headerTitle')}
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
            {t('DisableOverlay.descriptionTitle')}{' '}
            <Text style={{ color: Colors.error }}>{formattedCountdown}</Text>
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
            {t('DisableOverlay.headerBlockedTitle')}
          </JoloText>
        </View>
      )}
      {isRestoreAccess && (
        <AbsoluteBottom>
          <ScreenContainer.Padding>
            <BtnGroup>
              <Btn onPress={handleAccessRestore} type={BtnTypes.primary}>
                {t('DisableOverlay.submitBtn')}
              </Btn>
              <Space height={12} />
              <JoloText
                size={JoloTextSizes.tiniest}
                customStyles={{ color: Colors.white70 }}
              >
                {t('DisableOverlay.submitDescription')}
              </JoloText>
            </BtnGroup>
          </ScreenContainer.Padding>
        </AbsoluteBottom>
      )}
    </ScreenContainer>
  )
}

export default AppDisabled
