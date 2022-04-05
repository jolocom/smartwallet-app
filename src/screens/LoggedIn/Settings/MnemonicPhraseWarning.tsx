import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { CaretRight, WarningIcon } from '~/assets/svg'
import JoloText from '~/components/JoloText'
import Space from '~/components/Space'
import { StorageKeys } from '~/hooks/sdk'
import useSettings from '~/hooks/settings'
import useTranslation from '~/hooks/useTranslation'
import { setMnemonicWarningVisibility } from '~/modules/account/actions'
import { getMnemonicWarningVisibility } from '~/modules/account/selectors'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import { useToasts } from '~/hooks/toasts'

const MnemonicPhraseWarning = () => {
  const [isMnemonicWritten, setIsMnemonicWritten] = useState<
    boolean | undefined
  >(undefined)
  const { get: getFromStorage } = useSettings()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isMnemonicWarningVisible = useSelector(getMnemonicWarningVisibility)
  const { t } = useTranslation()

  useEffect(() => {
    /**
     * NOTE: getting `isOnboardingDone` value from the settings storage happens
     * because initially going through seedphrase screens was part of the
     * onboarding process and could not be skipped. We were recording if a user
     * has written a seed phrase with the value `isOnboardingDone`. Therefore,
     * checking this value is a part of the migration strategy to verify if
     * users of previos app rollout "wrote down" a seed phrase. For those
     * who have "written" seed phrase we won't show the worning
     * Date: 1643373457433 || Fri Jan 28 2022 13:38:08 GMT+0100 (Central European Standard Time)
     */
    Promise.all([
      getFromStorage(StorageKeys.mnemonicPhrase),
      getFromStorage(StorageKeys.isOnboardingDone),
    ]).then((res) => {
      setIsMnemonicWritten(res[0]?.isWritten || res[1]?.finished ? true : false)
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })
    }).catch(schedul)
  }, [])

  useEffect(() => {
    if (isMnemonicWritten !== undefined) {
      dispatch(setMnemonicWarningVisibility(!isMnemonicWritten))
    }
  }, [isMnemonicWritten])

  const handleNavigateToMnemonicPhrase = () => {
    navigation.navigate(ScreenNames.MnemonicPhrase)
  }

  if (isMnemonicWarningVisible === true)
    return (
      <>
        <TouchableOpacity
          onPress={handleNavigateToMnemonicPhrase}
          activeOpacity={0.9}
          style={styles.container}
        >
          <View style={{ width: 40, height: 35 }}>
            <WarningIcon />
          </View>
          <JoloText customStyles={styles.warningText} color={Colors.black}>
            {t('Settings.mnemonicPhraseWarning')}
          </JoloText>
          <CaretRight fillColor={Colors.black} />
        </TouchableOpacity>
        <Space height={17} />
      </>
    )
  return null
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.corn,
    borderRadius: 9,
    width: '100%',
    paddingTop: 14,
    paddingBottom: 11,
    paddingLeft: 14,
    paddingRight: 16,
  },
  warningText: {
    fontSize: BP({ large: 16, default: 14 }),
    lineHeight: BP({ large: 16, default: 14 }),
    fontFamily: Fonts.Medium,
    textAlign: 'left',
    marginLeft: 14,
    marginRight: 7,
    flex: 1,
    flexWrap: 'wrap',
  },
})
export default MnemonicPhraseWarning
