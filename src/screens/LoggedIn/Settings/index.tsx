import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'

import Btn, { BtnTypes } from '~/components/Btn'
import ScreenContainer from '~/components/ScreenContainer'
import { useBiometry } from '~/hooks/biometry'
import { useResetKeychainValues } from '~/hooks/deviceAuth'
import useMarketRating from '~/hooks/rateus'
import { StorageKeys } from '~/hooks/sdk'
import useSettings from '~/hooks/settings'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { resetAccount } from '~/modules/account/actions'
import { ScreenNames } from '~/types/screens'
import ClearIdentityBtn from './components/ClearIdentityBtn'
import Option from './components/Option'
import Section from './components/Section'
import DevelopmentSection from './Development'
import EnableBiometryOption from './EnableBiometryOption'
import EnableScreenshotsOption from './EnableScreenshotsOption'

const SettingsGeneral: React.FC = () => {
  const { t } = useTranslation()
  const resetServiceValuesInKeychain = useResetKeychainValues()
  const { resetBiometry } = useBiometry()
  const { set: setStorageValue } = useSettings()
  const { rateApp } = useMarketRating()
  const { scheduleErrorWarning } = useToasts()

  const dispatch = useDispatch()
  const navigation = useNavigation()

  const handleRateApp = () => {
    rateApp().catch(scheduleErrorWarning)
  }

  const handleLogout = useCallback(async () => {
    try {
      await resetBiometry()
      await resetServiceValuesInKeychain()
      // @ts-expect-error TODO: we should unite StorageKeys and SettingKeys
      await setStorageValue(StorageKeys.mnemonicPhrase, {
        isWritten: false,
      })
      dispatch(resetAccount())
    } catch (err) {
      console.log('Error occured while logging out')
      console.warn({ err })
    }
  }, [dispatch])

  const handleNavigateToScreen = (screen: ScreenNames) =>
    navigation.navigate(screen)

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 150,
        }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Section>
          <Section.Title>{t('Settings.preferencesSection')}</Section.Title>
          <Section.Block>
            <Option
              onPress={() => handleNavigateToScreen(ScreenNames.Language)}
            >
              <Option.Title title={t('Settings.languageBlock')} />
              <Option.RightIcon />
            </Option>
          </Section.Block>
        </Section>

        <Section>
          <Section.Title>{t('Settings.securitySection')}</Section.Title>
          <Section.Block>
            <Option
              onPress={() => handleNavigateToScreen(ScreenNames.ChangePin)}
            >
              <Option.Title title={t('Settings.changePasscodeBlock')} />
              <Option.RightIcon />
            </Option>
            <EnableBiometryOption />
            {Platform.OS === 'android' && <EnableScreenshotsOption />}
            {/* NOTE: commenting out till backup feature is ready  */}
            {/* <Option
              onPress={() => handleNavigateToScreen(ScreenNames.BackupIdentity)}
            >
              <View style={{ alignItems: 'flex-start' }}>
                <Option.Title title={t('Settings.backupBlock')} />
                {shouldWarnBackup() && (
                  <JoloText
                    kind={JoloTextKind.subtitle}
                    size={JoloTextSizes.tiniest}
                    color={Colors.error}
                    customStyles={{
                      textAlign: 'left',
                      lineHeight: 14,
                      marginTop: 10,
                    }}
                  >
                    {t('Settings.backupBlockWarning')}
                  </JoloText>
                )}
              </View>
            </Option> */}
          </Section.Block>
        </Section>

        <Section>
          <Section.Title>{t('Settings.generalSection')}</Section.Title>
          <Section.Block>
            <Option onPress={() => handleNavigateToScreen(ScreenNames.FAQ)}>
              <Option.Title title={t('Settings.faqBlock')} />
              <Option.RightIcon />
            </Option>
            <Option
              onPress={() => handleNavigateToScreen(ScreenNames.ContactUs)}
            >
              <Option.Title title={t('Settings.contactUsBlock')} />
              <Option.RightIcon />
            </Option>
            <Option onPress={handleRateApp}>
              <Option.Title title={t('Settings.rateBlock')} />
            </Option>
            <Option onPress={() => handleNavigateToScreen(ScreenNames.Imprint)}>
              <Option.Title title={t('Settings.imprintBlock')} />
              <Option.RightIcon />
            </Option>
            <Option onPress={() => handleNavigateToScreen(ScreenNames.About)}>
              <Option.Title title={t('Settings.aboutBlock')} />
              <Option.RightIcon />
            </Option>
          </Section.Block>
        </Section>
        {__DEV__ && <DevelopmentSection />}

        <ClearIdentityBtn />

        {__DEV__ && (
          <Btn
            type={BtnTypes.quinary}
            customContainerStyles={{ marginTop: 44 }}
            onPress={() => {
              handleLogout().catch(scheduleErrorWarning)
            }}
          >
            [DEV] Log out
          </Btn>
        )}
      </ScrollView>
    </ScreenContainer>
  )
}

export default SettingsGeneral
