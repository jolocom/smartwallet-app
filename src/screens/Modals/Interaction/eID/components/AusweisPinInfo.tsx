import { aa2Module } from '@jolocom/react-native-ausweis'
import { useNavigation } from '@react-navigation/native'
import { StackActions } from '@react-navigation/routers'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Btn, { BtnTypes } from '~/components/Btn'
import Collapsible from '~/components/Collapsible'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import eIDHooks from '../hooks'

export const AusweisPinInfo = () => {
  const { top } = useSafeArea()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { cancelFlow } = eIDHooks.useAusweisInteraction()

  const handleChangePinRedirect = () => {
    aa2Module.resetHandlers()
    cancelFlow()
    // Navigate to the InteractionSheet
    navigation.dispatch(StackActions.popToTop())
    // Replace InteractionSheet with AusweisChangePin
    navigation.dispatch(
      StackActions.replace(ScreenNames.Main, {
        screen: ScreenNames.AusweisChangePin,
        initial: false,
      }),
    )
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Collapsible
        renderScroll={() => (
          <Collapsible.Scroll
            containerStyles={styles.scrollContainer}
            style={{ height: '100%' }}
          >
            <Collapsible.Title text={t('AusweisPinInfo.header')}>
              <JoloText
                kind={JoloTextKind.title}
                weight={JoloTextWeight.regular}
              >
                {t('AusweisPinInfo.header')}
              </JoloText>
            </Collapsible.Title>
            <JoloText customStyles={styles.description}>
              {t('AusweisPinInfo.description')}
            </JoloText>
          </Collapsible.Scroll>
        )}
        renderHeader={() => (
          <Collapsible.Header
            customStyles={{ backgroundColor: Colors.mainDark }}
            type={NavHeaderType.Back}
          />
        )}
      >
        <View style={styles.buttonContainer}>
          <Btn
            testID={'ausweis-pass-info-change-btn'}
            onPress={handleChangePinRedirect}
            type={BtnTypes.quaternary}
          >
            {t('AusweisPinInfo.btn')}
          </Btn>
        </View>
      </Collapsible>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainDark,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: '30%',
  },
  description: {
    textAlign: 'left',
    marginTop: 28,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 16,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.mainDark,
  },
})
