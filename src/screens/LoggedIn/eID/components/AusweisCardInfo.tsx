import { useBackHandler } from '@react-native-community/hooks'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { useGoBack } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { TransparentModalsParamsList } from '../../Main'
import { CardInfoMode } from '../types'

const AusweisCardInfo = () => {
  const { mode, onDismiss } =
    useRoute<
      RouteProp<TransparentModalsParamsList, ScreenNames.AusweisCardInfo>
    >().params
  const { t } = useTranslation()
  const goBack = useGoBack()
  const navigation = useNavigation()

  const title = useMemo(() => {
    if (mode === CardInfoMode.blocked) {
      return t('AusweisUnlock.pukExhaustedHeader')
    } else if (mode === CardInfoMode.notBlocked) {
      return t('AusweisUnlock.notLockedHeader')
    } else if (mode === CardInfoMode.unblocked) {
      return t('AusweisUnlock.unlockedHeader')
    } else if (mode === CardInfoMode.standaloneUnblock) {
      return t('AusweisUnlock.standaloneUnblockHeader')
    }
  }, [mode])

  const handleDismiss = () => {
    onDismiss && onDismiss()
    goBack()
  }

  const handleRedirectToIdentity = () => {
    onDismiss && onDismiss()
    navigation.navigate(ScreenNames.Identity)
  }

  useBackHandler(() => true)

  return (
    <ScreenContainer
      backgroundColor={Colors.black95}
      customStyles={{ justifyContent: 'flex-end' }}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ScreenContainer.Padding>
          {mode !== CardInfoMode.standaloneUnblock ? (
            <JoloText
              kind={JoloTextKind.title}
              customStyles={{ alignSelf: 'center' }}
            >
              {title}
            </JoloText>
          ) : (
            <JoloText
              kind={JoloTextKind.title}
              customStyles={{ alignSelf: 'center' }}
            >
              {title?.split('"')[0]}
              <JoloText
                kind={JoloTextKind.title}
                customStyles={{
                  alignSelf: 'center',
                  textDecorationLine: 'underline',
                }}
                onPress={handleRedirectToIdentity}
              >
                {title?.split('"')[1]}
              </JoloText>
            </JoloText>
          )}
        </ScreenContainer.Padding>
      </View>
      <BtnGroup>
        <Btn
          type={BtnTypes.secondary}
          onPress={handleDismiss}
          customContainerStyles={{
            marginBottom: BP({ default: 40, xsmall: 20 }),
          }}
        >
          {t('AusweisUnlock.closeBtn')}
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

export default AusweisCardInfo
