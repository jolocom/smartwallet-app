import React, { useEffect, useRef } from 'react'
import { RouteProp, useRoute } from '@react-navigation/core'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ErrorIcon, PurpleTickSuccess, SuccessTick } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { AusweisStackParamList } from '..'
import { eIDScreens } from '../types'
import BP from '~/utils/breakpoints'
import { useGoBack } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'

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
  const { t } = useTranslation()

  const goBack = useGoBack()
  const { inoperative, deactivated } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.CompatibilityResult>>()
      .params

  const isFailed = inoperative || deactivated

  useEffect(() => {
    const id = setTimeout(() => {
      goBack()
    }, 5000)

    return () => {
      clearTimeout(id)
    }
  }, [])

  return (
    <ScreenContainer backgroundColor={Colors.black}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={goBack}
        style={{ justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <View style={styles.headerContainer}>
          <JoloText kind={JoloTextKind.title}>
            {t('AusweisCompatibilityStatus.header')}
          </JoloText>
        </View>
        <View style={styles.resultContainer}>
          {isFailed ? (
            <JoloText size={JoloTextSizes.big} color={Colors.error}>
              {t('AusweisCompatibilityStatus.error')}
            </JoloText>
          ) : (
            <>
              <SuccessResult title={t('AusweisCompatibilityStatus.status1')} />
              <SuccessResult title={t('AusweisCompatibilityStatus.status2')} />
              <SuccessResult title={t('AusweisCompatibilityStatus.status3')} />
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
      </TouchableOpacity>
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
    padding: 17,
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
