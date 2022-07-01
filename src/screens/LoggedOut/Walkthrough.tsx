import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { StackActions, useNavigation } from '@react-navigation/core'
import CustomCarousel from './Carousel'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import BtnGroup from '~/components/BtnGroup'
import { ScreenNames } from '~/types/screens'
import { useRedirect } from '~/hooks/navigation'
import { Colors } from '~/utils/colors'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import { useLoader } from '~/hooks/loader'
import { useCreateIdentity } from '~/hooks/sdk'
import { setLogged, setTermsConsentVisibility } from '~/modules/account/actions'
import {
  getIsTermsConsentOutdated,
  getIsTermsConsentVisible,
} from '~/modules/account/selectors'
import { usePrevious } from '~/hooks/generic'

const useWalkthroughProceed = () => {
  const loader = useLoader()
  const createIdentity = useCreateIdentity()
  const dispatch = useDispatch()
  const isTermsConsentOutdated = useSelector(getIsTermsConsentOutdated)
  const isTermsConsentVisible = useSelector(getIsTermsConsentVisible)
  const redirect = useRedirect()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const pendingActionRef = useRef(() => {})
  const prevTermsConsetVisibility = usePrevious(isTermsConsentVisible)

  useEffect(() => {
    if (isTermsConsentVisible === false && prevTermsConsetVisibility === true) {
      setTimeout(() => {
        pendingActionRef.current()
      }, 100)
    }
  }, [isTermsConsentVisible])

  const registerUser = async () => {
    const handleDone = (error: any) => {
      if (!error) {
        dispatch(setLogged(true))
      } else {
        navigation.dispatch(StackActions.replace(ScreenNames.Walkthrough))
      }
    }
    await loader(
      createIdentity,
      { showSuccess: false, loading: t('Wallet.prepareWallet') },
      handleDone,
    )
  }
  const handleProceed = (cb: () => Promise<void>) => {
    return () => {
      if (isTermsConsentOutdated) {
        dispatch(setTermsConsentVisibility(true))
        // Idle screen serves as a background when terms consent is hiding, so we don't see for a fraction of a second the Walkthrough screen
        navigation.navigate(ScreenNames.Idle)
        pendingActionRef.current = cb
      } else {
        cb()
      }
    }
  }
  const handleRegistration = handleProceed(registerUser)
  const handleRecovery = handleProceed(async () => {
    redirect(ScreenNames.IdentityRecovery)
  })
  return { handleRegistration, handleRecovery }
}

const Walkthrough: React.FC = () => {
  const { t } = useTranslation()
  const { handleRegistration, handleRecovery } = useWalkthroughProceed()

  const insets = useSafeArea()

  return (
    <ScreenContainer
      isFullscreen
      customStyles={{ marginTop: -insets.top }}
      backgroundColor={Colors.abbey}
    >
      <View>
        <CustomCarousel />
      </View>
      <AbsoluteBottom customStyles={styles.consistentContainer}>
        <BtnGroup>
          <Btn size={BtnSize.large} onPress={handleRegistration}>
            {t('Walkthrough.registrationBtn')}
          </Btn>
          <Btn
            size={BtnSize.large}
            type={BtnTypes.secondary}
            onPress={handleRecovery}
          >
            {t('Walkthrough.recoveryBtn')}
          </Btn>
        </BtnGroup>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  consistentContainer: {
    paddingHorizontal: '5%',
  },
})

export default Walkthrough
