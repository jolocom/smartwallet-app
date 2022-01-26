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
import { setMnemonicWarningVisibility } from '~/modules/account/actions'
import { getMnemonicWarningVisibility } from '~/modules/account/selectors'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

const MnemonicPhraseWarning = () => {
  const [isMnemonicWritten, setIsMnemonicWritten] =
    useState<boolean | undefined>(undefined)
  const { get: getFromStorage } = useSettings()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isMnemonicWarningVisible = useSelector(getMnemonicWarningVisibility)

  useEffect(() => {
    getFromStorage(StorageKeys.mnemonicPhrase).then((res) => {
      setIsMnemonicWritten(res?.isWritten ? true : false)
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })
    })
  }, [])

  useEffect(() => {
    dispatch(setMnemonicWarningVisibility(!isMnemonicWritten))
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
            Your data run the risk of being irreversibly lost, please proceeed
            with the seedphrase
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
