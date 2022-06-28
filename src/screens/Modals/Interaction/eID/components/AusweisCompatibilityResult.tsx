import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { StyleSheet, View } from 'react-native'
import {
  ErrorIcon,
  PurpleTickSuccess,
  SuccessTick,
  ErrorIconYellow,
} from '~/assets/svg'
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

interface ResultProps {
  result: 'success' | 'error'
  title: string
  color?: Colors
}

const Result: React.FC<ResultProps> = ({ title, color, result }) => {
  return (
    <Option customStyles={{ width: '100%', backgroundColor: Colors.black }}>
      <Option.Title
        title={title}
        customStyles={{ width: '80%', color: color }}
      />
      <Option.IconContainer>
        {result === 'success' ? (
          <PurpleTickSuccess w={20} h={20} />
        ) : (
          <ErrorIconYellow />
        )}
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
            <View>
              {isFailed ? (
                <Result
                  result={'error'}
                  title={t('AusweisCompatibilityStatus.status1')}
                  color={Colors.error}
                />
              ) : (
                <Result
                  result={'success'}
                  title={t('AusweisCompatibilityStatus.status1')}
                  color={Colors.white90}
                />
              )}
              {deactivated ? (
                <Result
                  result={'error'}
                  title={t('AusweisCompatibilityStatus.status2')}
                  color={Colors.error}
                />
              ) : (
                <Result
                  result={'success'}
                  title={t('AusweisCompatibilityStatus.status2')}
                  color={Colors.white90}
                />
              )}
              {inoperative ? (
                <Result
                  result={'error'}
                  title={t('AusweisCompatibilityStatus.status3')}
                  color={Colors.error}
                />
              ) : (
                <Result
                  result={'success'}
                  title={t('AusweisCompatibilityStatus.status3')}
                  color={Colors.white90}
                />
              )}
            </View>
          </View>
          <View style={styles.btnContainer}>
            <Btn onPress={handleGoBack}>{t('CredentialForm.confirmBtn')}</Btn>
          </View>
        </BottomSheet>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: BP({ default: 36, large: 72 }),
  },
  resultContainer: {
    width: '100%',
  },
  iconContainer: {
    borderRadius: 34,
    borderWidth: 3,
    width: 67,
    height: 67,
    padding: 17,
    borderColor: Colors.white90,
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnContainer: {
    width: '100%',
    marginBottom: 24,
    marginTop: 36,
  },
})
