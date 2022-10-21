import React, { useState } from 'react'
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
  hasBorder?: boolean
}

const Result: React.FC<ResultProps> = ({
  title,
  color,
  result,
  hasBorder = true,
}) => {
  return (
    <Option
      customStyles={{
        width: '100%',
        backgroundColor: Colors.haiti,
      }}
      hasBorder={hasBorder}
    >
      <Option.Title
        title={title}
        customStyles={{
          width: '80%',
          color: color,
        }}
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
  const [sheetVisible, setSheetVisible] = useState(true)

  const isFailed = inoperative || deactivated

  const handleDone = () => {
    setSheetVisible(false)
    setTimeout(() => {
      goBack()
    }, 100)
  }

  return (
    <ScreenContainer backgroundColor={Colors.black65} isFullscreen>
      <BottomSheet
        visible={sheetVisible}
        customStyles={styles.sheet}
        onDismiss={handleDone}
      >
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            {isFailed || deactivated ? (
              <ErrorIcon color={Colors.white90} />
            ) : (
              <SuccessTick color={Colors.white90} />
            )}
          </View>
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
                hasBorder={false}
              />
            ) : (
              <Result
                result={'success'}
                title={t('AusweisCompatibilityStatus.status3')}
                color={Colors.white90}
                hasBorder={false}
              />
            )}
          </View>
        </View>
        <View style={styles.btnContainer}>
          <Btn onPress={handleDone}>{t('CredentialForm.confirmBtn')}</Btn>
        </View>
      </BottomSheet>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: BP({ default: 36, large: 72 }),
  },
  resultContainer: {
    width: '100%',
    backgroundColor: 'red',
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    marginTop: -33,
    borderRadius: 34,
    borderWidth: 3,
    width: 67,
    height: 67,
    padding: 17,
    borderColor: Colors.white90,
    backgroundColor: Colors.mainDark,
    justifyContent: 'center',
  },
  btnContainer: {
    width: '100%',
    marginBottom: 24,
    marginTop: 36,
  },
  sheet: {
    backgroundColor: Colors.mainDark,
    marginHorizontal: 8,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 16,
  },
})
