import React, { useCallback } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'

import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useDispatch } from 'react-redux'
import { accountReset } from '~/modules/account/actions'
import Btn, { BtnTypes } from '~/components/Btn'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { useRedirectTo } from '~/hooks/navigation'
import { useResetKeychainValues } from '~/hooks/deviceAuth'

const SECTIONS = [
  {
    id: 'appPref',
    name: strings.APP_PREFERENCES,
    screens: [
      { id: 'language', name: strings.LANGUAGE, screen: ScreenNames.Language },
    ],
  },
  {
    id: 'security',
    name: strings.SECURITY,
    screens: [
      {
        id: 'changePasscode',
        name: strings.CHANGE_PIN,
        screen: ScreenNames.ChangePin,
      },
    ],
  },
  {
    id: 'general',
    name: strings.GENERAL,
    screens: [
      { id: 'faq', name: strings.FAQ, screen: ScreenNames.FAQ },
      {
        id: 'contactus',
        name: strings.CONTACT_US,
        screen: ScreenNames.ContactUs,
      },
      { id: 'rateus', name: strings.RATE_US, screen: ScreenNames.RateUs },
      { id: 'about', name: strings.ABOUT, screen: ScreenNames.About },
      { id: 'imprint', name: strings.IMPRINT, screen: ScreenNames.Imprint },
    ],
  },
]

interface SectionOptionPropsI {
  label: string
  screenRedirectTo?: ScreenNames
  onPress?: () => void
}

const SectionOption: React.FC<SectionOptionPropsI> = ({
  label,
  screenRedirectTo,
  onPress,
}) => {
  const handlePress = screenRedirectTo
    ? useRedirectTo(screenRedirectTo)
    : onPress
  return (
    <TouchableOpacity onPress={handlePress} style={styles.sectionOption}>
      <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
        {label}
      </JoloText>
      <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
        arrow
      </JoloText>
    </TouchableOpacity>
  )
}

const SettingsGeneral = () => {
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const dispatch = useDispatch()
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
      >
        {SECTIONS.map((section) => (
          <View style={styles.sectionContainer}>
            <JoloText
              kind={JoloTextKind.title}
              size={JoloTextSizes.middle}
              weight={JoloTextWeight.regular}
              customStyles={{
                marginBottom: BP({ large: 40, medium: 40, default: 20 }),
              }}
            >
              {section.name}
            </JoloText>
            <View style={styles.sectionOptionContainer}>
              {section.screens.map((option, idx) => (
                <SectionOption
                  label={option.name}
                  screenRedirectTo={option.screen}
                />
              ))}
            </View>
          </View>
        ))}
        <Btn type={BtnTypes.secondary} onPress={handleLogout}>
          {strings.LOG_OUT}
        </Btn>
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'flex-start',
    marginBottom: 44,
    alignItems: 'flex-start',
    width: '100%',
  },
  sectionOptionContainer: {
    backgroundColor: Colors.black,
    width: '100%',
    borderRadius: 8,
  },
  sectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    width: '100%',
    borderBottomColor: Colors.mainBlack,
    borderBottomWidth: 1,
  },
})

export default SettingsGeneral
