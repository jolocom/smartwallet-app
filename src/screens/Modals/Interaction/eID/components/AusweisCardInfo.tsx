import { aa2Module } from '@jolocom/react-native-ausweis'
import { useBackHandler } from '@react-native-community/hooks'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { Trans } from 'react-i18next'
import { View } from 'react-native'

import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { useGoBack } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import { TransparentModalsParamsList } from '~/screens/LoggedIn/Main'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
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
      /**
       * Note: translation is unusual here in {en,de}.json files.
       * <1>${screen}</1> means that input `screen` variable as a
       * child of 1st node: 0 node is the text `AusweisUnlock.standaloneUnblockHeader`,
       * 1 node is clickable text with variable `screen` as a child
       */
      return t('AusweisUnlock.standaloneUnblockHeader', {
        screen: t('AusweisUnlock.identityScreen'),
      })
    }
  }, [mode])

  const handleDismiss = () => {
    aa2Module.resetHandlers()
    onDismiss && onDismiss()
    goBack()
  }

  const handleRedirectToIdentity = () => {
    aa2Module.resetHandlers()
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
            <Trans>
              <JoloText
                kind={JoloTextKind.title}
                customStyles={{ alignSelf: 'center' }}
              >
                {title}
                <JoloText
                  kind={JoloTextKind.title}
                  customStyles={{
                    alignSelf: 'center',
                    textDecorationLine: 'underline',
                  }}
                  testID="identity-screen-link"
                  onPress={handleRedirectToIdentity}
                />
              </JoloText>
            </Trans>
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
