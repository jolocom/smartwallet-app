import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import { useNavigation } from '@react-navigation/core'
import { ScreenNames } from '~/types/screens'
import {
  useAusweisCompatibilityCheck,
  useCheckNFC,
} from '~/screens/LoggedIn/eID/hooks'
import useTranslation from '~/hooks/useTranslation'
import { eIDScreens } from '../eID/types'

export const AusweisIdentity = () => {
  const { t } = useTranslation()
  const { startCheck: startCompatibilityCheck } = useAusweisCompatibilityCheck()
  const { checkNfcSupport } = useCheckNFC()
  const navigation = useNavigation()

  const handleCompatibilityCheck = () => {
    checkNfcSupport(startCompatibilityCheck)
  }

  const handleChangePin = () => {
    navigation.navigate(ScreenNames.AusweisChangePin)
  }

  const handleUnlockCard = () => {
    navigation.navigate(ScreenNames.eId, { screen: eIDScreens.CanInfo })
  }

  return (
    <View
      style={{ marginBottom: BP({ large: 0, default: 80 }) }}
      testID="home-ausweis-identity"
    >
      <View style={styles.cardContainer}>
        <Image
          resizeMode="contain"
          source={require('~/assets/images/updatedCard.png')}
          style={styles.card}
        />
      </View>
      <View>
        <JoloText kind={JoloTextKind.title} weight={JoloTextWeight.regular}>
          {t('AusweisIdentity.header')}
        </JoloText>
        <JoloText
          size={JoloTextSizes.mini}
          customStyles={{ marginTop: 8, marginHorizontal: 16 }}
        >
          {t('AusweisIdentity.subheader')}
        </JoloText>

        <View style={styles.btnContainer}>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            onPress={handleCompatibilityCheck}
          >
            {t('AusweisIdentity.compatibilityBtn')}
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            onPress={handleChangePin}
          >
            {t('AusweisIdentity.changePinBtn')}
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            onPress={handleUnlockCard}
          >
            {t('AusweisIdentity.unlockBtn')}
          </Btn>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    aspectRatio: 1.55,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    transform: [{ scale: 1.1 }],
  },
  btn: {
    borderWidth: 1,
    borderColor: Colors.borderGray20,
  },
  btnContainer: {
    marginTop: BP({ default: 36, large: 84 }),
  },
})
