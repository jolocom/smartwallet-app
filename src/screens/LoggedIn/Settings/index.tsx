import React, { useCallback, useState } from 'react'
import { Alert, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'

import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import { JoloTextSizes } from '~/utils/fonts'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { accountReset } from '~/modules/account/actions'
import { useResetKeychainValues } from '~/hooks/deviceAuth'

import Section from './components/Section'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import Option from './components/Option'
import DevelopmentSection from './Development'
import EnableBiometryOption from './EnableBiometryOption'
import { useBiometry } from '~/hooks/biometry'

const SettingsGeneral: React.FC = () => {
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)
  const { resetBiometry } = useBiometry()

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const handleLogout = useCallback(async () => {
    try {
      await resetBiometry()
      await resetServiceValuesInKeychain()
      dispatch(accountReset())
    } catch (err) {
      console.log('Error occured while logging out')
      console.warn({ err })
    }
  }, [dispatch])

  const handleNavigateToScreen = (screenName: ScreenNames) => {
    navigation.navigate(screenName)
  }

  const handleRate = () => {
    Alert.alert('Rate us', 'Please rate us')
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingTop: 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 150,
          marginTop: BP({ large: 56, medium: 56, default: 32 }),
        }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {__DEV__ && <DevelopmentSection />}
        <Section title={strings.APP_PREFERENCES}>
          <Option onPress={() => handleNavigateToScreen(ScreenNames.Language)}>
            <Option.Title title={strings.LANGUAGE} />
            <Option.RightIcon />
          </Option>
        </Section>
        <Section title={strings.SECURITY}>
          <Option onPress={() => handleNavigateToScreen(ScreenNames.ChangePin)}>
            <Option.Title title={strings.CHANGE_PIN} />
            <Option.RightIcon />
          </Option>
          <EnableBiometryOption />
          <Option
            onPress={() => handleNavigateToScreen(ScreenNames.BackupIdentity)}
          >
            <View style={{ alignItems: 'flex-start' }}>
              <Option.Title title={strings.BACKUP_IDENTITY} />
              <JoloText
                kind={JoloTextKind.subtitle}
                size={JoloTextSizes.tiniest}
                color={Colors.error}
                customStyles={{
                  textAlign: 'left',
                  lineHeight: 14,
                }}
              >
                {strings.YOUR_DOCUMENTS_ARE_AT_RISK}
              </JoloText>
            </View>
          </Option>
        </Section>
        <Section title={strings.GENERAL}>
          <Option onPress={() => handleNavigateToScreen(ScreenNames.FAQ)}>
            <Option.Title title={strings.FAQ} />
            <Option.RightIcon />
          </Option>
          <Option onPress={() => handleNavigateToScreen(ScreenNames.ContactUs)}>
            <Option.Title title={strings.CONTACT_US} />
            <Option.RightIcon />
          </Option>
          <Option onPress={handleRate}>
            <Option.Title title={strings.RATE_US} />
          </Option>
          <Option onPress={() => handleNavigateToScreen(ScreenNames.Imprint)}>
            <Option.Title title={strings.IMPRINT} />
            <Option.RightIcon />
          </Option>
          <Option onPress={() => handleNavigateToScreen(ScreenNames.About)}>
            <Option.Title title={strings.ABOUT} />
            <Option.RightIcon />
          </Option>
        </Section>
        {__DEV__ ? (
          <Btn type={BtnTypes.secondary} onPress={handleLogout}>
            {strings.LOG_OUT}
          </Btn>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  )
}

export default SettingsGeneral
