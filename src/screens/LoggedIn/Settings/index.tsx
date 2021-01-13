import React, { useCallback } from 'react'
import { View } from 'react-native'
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
import { resetAccount } from '~/modules/account/actions'
import { useResetKeychainValues } from '~/hooks/deviceAuth'

import Section from './components/Section'
import { Colors } from '~/utils/colors'
import Option from './components/Option'
import DevelopmentSection from './Development'
import EnableBiometryOption from './EnableBiometryOption'
import { useBiometry } from '~/hooks/biometry'
import useBackup from '~/hooks/backup'
import useMarketRating from '~/hooks/rateus'

const SettingsGeneral: React.FC = () => {
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)
  const { resetBiometry } = useBiometry()
  const { shouldWarnBackup } = useBackup()
  const { rateApp } = useMarketRating()

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const handleLogout = useCallback(async () => {
    try {
      await resetBiometry()
      await resetServiceValuesInKeychain()
      dispatch(resetAccount())
    } catch (err) {
      console.log('Error occured while logging out')
      console.warn({ err })
    }
  }, [dispatch])

  const handleNavigateToScreen = (screenName: ScreenNames) => {
    navigation.navigate(screenName)
  }

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
          <Section.Title>{strings.APP_PREFERENCES}</Section.Title>
          <Section.Block>
            <Option
              onPress={() => handleNavigateToScreen(ScreenNames.Language)}
            >
              <Option.Title title={strings.LANGUAGE} />
              <Option.RightIcon />
            </Option>
          </Section.Block>
        </Section>

        <Section>
          <Section.Title>{strings.SECURITY}</Section.Title>
          <Section.Block>
            <Option
              onPress={() => handleNavigateToScreen(ScreenNames.ChangePin)}
            >
              <Option.Title title={strings.CHANGE_PIN} />
              <Option.RightIcon />
            </Option>
            <EnableBiometryOption />
            <Option
              onPress={() => handleNavigateToScreen(ScreenNames.BackupIdentity)}
            >
              <View style={{ alignItems: 'flex-start' }}>
                <Option.Title title={strings.BACKUP_IDENTITY} />
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
                    {strings.YOUR_DOCUMENTS_ARE_AT_RISK}
                  </JoloText>
                )}
              </View>
            </Option>
          </Section.Block>
        </Section>

        <Section>
          <Section.Title>{strings.GENERAL}</Section.Title>
          <Section.Block>
            <Option onPress={() => handleNavigateToScreen(ScreenNames.FAQ)}>
              <Option.Title title={strings.FAQ} />
              <Option.RightIcon />
            </Option>
            <Option
              onPress={() => handleNavigateToScreen(ScreenNames.ContactUs)}
            >
              <Option.Title title={strings.CONTACT_US} />
              <Option.RightIcon />
            </Option>
            <Option onPress={rateApp}>
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
          </Section.Block>
        </Section>
        {__DEV__ && <DevelopmentSection />}

        <Btn
          type={BtnTypes.quinary}
          onPress={handleLogout}
          customContainerStyles={{ marginTop: 60 }}
        >
          {strings.EMPTY_WALLET}
        </Btn>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.tiniest}
          customStyles={{ marginTop: 20, opacity: 0.2 }}
        >
          {strings.YOUR_IDENTITY_WILL_NOT_BE_DELETED}
        </JoloText>
      </ScrollView>
    </ScreenContainer>
  )
}

export default SettingsGeneral
