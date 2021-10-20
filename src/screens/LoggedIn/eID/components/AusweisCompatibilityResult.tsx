import React, { useEffect } from 'react'
import { RouteProp, useRoute } from '@react-navigation/core'
import { StyleSheet, View } from 'react-native'
import { ErrorIcon, PurpleTickSuccess, SuccessTick } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { AusweisStackParamList } from '..'
import { eIDScreens } from '../types'
import BP from '~/utils/breakpoints'
import { useGoBack } from '~/hooks/navigation'
import { useBackHandler } from '@react-native-community/hooks'

const SuccessResult: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View style={styles.successContainer}>
      <JoloText size={JoloTextSizes.big}>{title}</JoloText>
      <View style={styles.successTickContainer}>
        <PurpleTickSuccess />
      </View>
    </View>
  )
}

export const AusweisCompatibilityResult: React.FC = () => {
  const goBack = useGoBack()
  const { inoperative, deactivated } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.CompatibilityResult>>()
      .params

  const isFailed = inoperative || deactivated

  useEffect(() => {
    setTimeout(() => {
      goBack()
    }, 3000)
  }, [])

  useBackHandler(() => {
    return true
  })

  return (
    <ScreenContainer
      backgroundColor={Colors.black}
      customStyles={{ justifyContent: 'flex-end' }}
    >
      <View style={styles.headerContainer}>
        <JoloText kind={JoloTextKind.title}>Compatibility check</JoloText>
      </View>
      <View style={styles.resultContainer}>
        {isFailed ? (
          <JoloText size={JoloTextSizes.big} color={Colors.error}>
            {inoperative
              ? 'This card is inoperative'
              : 'Please change your transport PIN before you start using your card'}
          </JoloText>
        ) : (
          <>
            <SuccessResult title={'ID card access succesfull'} />
            <SuccessResult title={'Online identification feature enabled'} />
            <SuccessResult title={'NFC Supported'} />
          </>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.iconContainer}>
          {isFailed ? (
            <ErrorIcon color={Colors.white90} />
          ) : (
            <SuccessTick color={Colors.white90} />
          )}
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  resultContainer: {
    flex: 2,
    paddingTop: BP({ default: 32, large: 52 }),
    justifyContent: 'flex-start',
    paddingHorizontal: BP({ default: 32, large: 52 }),
  },
  iconContainer: {
    borderRadius: 34,
    borderWidth: 3,
    width: 67,
    height: 67,
    borderColor: Colors.white90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  successTickContainer: {
    width: 20,
    height: 20,
    marginTop: 16,
  },
})
