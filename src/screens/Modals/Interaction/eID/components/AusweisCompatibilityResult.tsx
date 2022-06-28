import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { StyleSheet, View, Platform } from 'react-native'
import { ErrorIcon, PurpleTickSuccess, SuccessTick } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import { AusweisStackParamList } from '..'
import { eIDScreens } from '../types'
import BP from '~/utils/breakpoints'
import { useGoBack } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import Option from '~/screens/LoggedIn/Settings/components/Option'
import Btn from '~/components/Btn'
import BottomSheet from '~/components/BottomSheet'

const SuccessResult: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Option customStyles={{ width: '100%', backgroundColor: Colors.black }}>
      <Option.Title title={title} customStyles={{ width: '80%' }} />
      <Option.IconContainer>
        <PurpleTickSuccess w={20} h={20} />
      </Option.IconContainer>
    </Option>
  )
}

const ErrorResult: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Option customStyles={{ width: '100%', backgroundColor: Colors.black }}>
      <Option.Title
        title={title}
        customStyles={{ width: '80%', color: Colors.error }}
      />
      <Option.IconContainer>
        <ErrorIcon color={Colors.error} w={20} h={20} />
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

  const handleGoBack = () => {
    goBack()
  }

  return (
    <ScreenContainer backgroundColor={Colors.black65} isFullscreen>
      <View style={{ width: '90%', paddingBottom: 36 }}>
        <BottomSheet onDismiss={handleGoBack}>
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
            <View styles={{ flexDirection: 'row', width: '100%' }}>
              {isFailed ? (
                <ErrorResult title={t('AusweisCompatibilityStatus.status1')} />
              ) : (
                <SuccessResult
                  title={t('AusweisCompatibilityStatus.status1')}
                />
              )}
              {deactivated ? (
                <ErrorResult title={t('AusweisCompatibilityStatus.status2')} />
              ) : (
                <SuccessResult
                  title={t('AusweisCompatibilityStatus.status2')}
                />
              )}
              {inoperative ? (
                <ErrorResult title={t('AusweisCompatibilityStatus.status3')} />
              ) : (
                <SuccessResult
                  title={t('AusweisCompatibilityStatus.status3')}
                />
              )}
            </View>
          </View>
          <View style={styles.btn}>
            <Btn onPress={handleGoBack}>Done</Btn>
          </View>
        </BottomSheet>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
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
  btn: {
    width: '100%',
    // justifyContent: 'center',
    marginBottom: 24,
    marginTop: 36,
  },
})
