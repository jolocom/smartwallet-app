import React, { useCallback } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'
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

import SectionOption from './components/SectionOption'
import Section from './Section'

const SettingsGeneral: React.FC = () => {
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('biometry')
      resetServiceValuesInKeychain()
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
      }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Section title={strings.APP_PREFERENCES}>
          <SectionOption
            label={strings.LANGUAGE}
            onPress={() => handleNavigateToScreen(ScreenNames.Language)}
          >
            <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
              arrow
            </JoloText>
          </SectionOption>
        </Section>
        <Section title={strings.SECURITY}>
          <SectionOption
            label={strings.CHANGE_PIN}
            onPress={() => handleNavigateToScreen(ScreenNames.ChangePin)}
          >
            <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
              arrow
            </JoloText>
          </SectionOption>
        </Section>
        <Section title={strings.GENERAL}>
          <SectionOption
            label={strings.FAQ}
            onPress={() => handleNavigateToScreen(ScreenNames.FAQ)}
          >
            <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
              arrow
            </JoloText>
          </SectionOption>
          <SectionOption
            label={strings.CONTACT_US}
            onPress={() => handleNavigateToScreen(ScreenNames.ContactUs)}
          >
            <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
              arrow
            </JoloText>
          </SectionOption>
          <SectionOption label={strings.RATE_US} onPress={handleRate}>
            <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
              arrow
            </JoloText>
          </SectionOption>
          <SectionOption
            label={strings.ABOUT}
            onPress={() => handleNavigateToScreen(ScreenNames.About)}
          >
            <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
              arrow
            </JoloText>
          </SectionOption>
          <SectionOption
            label={strings.IMPRINT}
            onPress={() => handleNavigateToScreen(ScreenNames.Imprint)}
          >
            <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
              arrow
            </JoloText>
          </SectionOption>
        </Section>
        <Btn type={BtnTypes.secondary} onPress={handleLogout}>
          {strings.LOG_OUT}
        </Btn>
      </ScrollView>
    </ScreenContainer>
  )
}

export default SettingsGeneral
