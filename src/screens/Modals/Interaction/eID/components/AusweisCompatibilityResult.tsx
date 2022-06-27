import React, { useEffect } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native'
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
import Option from '~/screens/LoggedIn/Settings/components/Option'

const SuccessResult: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Option customStyles={{ width: '100%' }}>
      <Option.Title title={title} customStyles={{ width: '80%' }} />
      <Option.IconContainer>
        <PurpleTickSuccess w={20} h={20} />
      </Option.IconContainer>
    </Option>
  )
}

export const AusweisCompatibilityResult: React.FC = () => {
  const { t } = useTranslation()
  const goBack = useGoBack()
  const { inoperative, deactivated } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.CompatibilityResult>>()
      .params

  const isFailed = inoperative || deactivated

  // useEffect(() => {
  //   const id = setTimeout(() => {
  //     goBack()
  //   }, 5000)

  //   return () => {
  //     clearTimeout(id)
  //   }
  // }, [])

  return (
    <ScreenContainer backgroundColor={Colors.black80}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={goBack}
        style={{ justifyContent: 'flex-end', alignItems: 'center' }}
        testID="dismissable-background"
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            {isFailed ? (
              <ErrorIcon color={Colors.white90} />
            ) : (
              <SuccessTick color={Colors.white90} />
            )}
          </View>
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
              <View styles={{ flexDirection: 'row', width: '100%' }}>
                <SuccessResult
                  title={t('AusweisCompatibilityStatus.status1')}
                />
                <SuccessResult
                  title={t('AusweisCompatibilityStatus.status2')}
                />
                <SuccessResult
                  title={t('AusweisCompatibilityStatus.status3')}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: BP({ default: 64, small: 44, xsmall: 44 }),
  },
  headerContainer: {
    justifyContent: 'flex-end',
    marginBottom: BP({ default: 36, large: 72 }),
  },
  resultContainer: {
    justifyContent: 'flex-start',
    width: '100%',
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
    marginBottom: 20,
  },
  successContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingVertical: Platform.select({
      ios: 11,
      android: 16,
    }),
    width: '100%',
    alignItems: 'center',
  },

  successTickContainer: {
    width: 20,
    height: 20,
  },
  joloTextContainer: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
