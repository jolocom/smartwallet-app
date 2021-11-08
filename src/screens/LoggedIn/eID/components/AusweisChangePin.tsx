import { useIsFocused, useNavigation } from '@react-navigation/core'
import React, { useCallback, useEffect } from 'react'
import { Platform, View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { CardInfo } from 'react-native-aa2-sdk/js/types'
import { useDispatch } from 'react-redux'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import { usePrevious } from '~/hooks/generic'
import { setPopup } from '~/modules/appState/actions'

import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { IS_ANDROID } from '~/utils/generic'

import { useAusweisInteraction } from '../hooks'
import { AusweisPasscodeMode, eIDScreens } from '../types'

interface WhateverProps {
  headerText: string
  descriptionText: string
  hasInlineBtn?: boolean
  btnText: string
  onPress: () => void
}

const TitleDescAction: React.FC<WhateverProps> = ({
  headerText,
  descriptionText,
  hasInlineBtn = false,
  btnText,
  onPress,
}) => {
  return (
    <View style={{ marginBottom: BP({ default: 30, xsmall: 20 }) }}>
      <ScreenContainer.Padding distance={BP({ default: 27, xsmall: 20 })}>
        <JoloText
          kind={JoloTextKind.title}
          customStyles={{ marginBottom: BP({ large: 12, default: 8 }) }}
        >
          {headerText}
        </JoloText>
        <JoloText color={Colors.osloGray}>
          {descriptionText}
          {hasInlineBtn && (
            <JoloText onPress={onPress} color={Colors.activity}>
              ...{btnText}
            </JoloText>
          )}
        </JoloText>
        {!hasInlineBtn && (
          <Btn onPress={onPress} type={BtnTypes.quaternary}>
            {btnText}
          </Btn>
        )}
      </ScreenContainer.Padding>
    </View>
  )
}

const AusweisChangePin = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const prevIsFocused = usePrevious(isFocused)
  const { checkCardValidity, cancelFlow } = useAusweisInteraction()
  const dispatch = useDispatch()

  const pinHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.EnterPIN,
        params: {
          mode: AusweisPasscodeMode.PIN,
        },
      })
    })
  }, [])

  const canHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.EnterPIN,
        params: {
          mode: AusweisPasscodeMode.CAN,
        },
      })
    })
  }, [])

  const pukHandler = useCallback((card: CardInfo) => {
    checkCardValidity(card, () => {
      navigation.navigate(ScreenNames.eId, {
        screen: eIDScreens.EnterPIN,
        params: {
          mode: AusweisPasscodeMode.PUK,
        },
      })
    })
  }, [])

  const setupHandlers = () => {
    aa2Module.resetHandlers()

    aa2Module.setHandlers({
      handleCardRequest: () => {
        if (IS_ANDROID) {
          navigation.navigate(ScreenNames.eId, {
            screen: eIDScreens.AusweisScanner,
            params: { onDismiss: cancelFlow },
          })
        }
      },
      handlePinRequest: (card) => {
        pinHandler(card)
      },
      handlePukRequest: (card) => {
        pukHandler(card)
      },
      handleCanRequest: (card) => {
        canHandler(card)
      },
      handleChangePinCancel: () => {},
    })
  }

  useEffect(() => {
    if (isFocused === true && !Boolean(prevIsFocused)) {
      setupHandlers()
    }
  }, [isFocused])

  const handleChange5DigPin = () => {
    console.warn('not implemented')
  }
  const handleChange6DigPin = () => {
    if (Platform.OS === 'ios') {
      dispatch(setPopup(true))
    }
    aa2Module.changePin()
  }
  const handlePreviewAuthorityInfo = () => {
    console.warn('not implemented')
  }

  return (
    <ScreenContainer
      hasHeaderBack
      navigationStyles={{ backgroundColor: Colors.mainBlack }}
      customStyles={{ justifyContent: 'space-around' }}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TitleDescAction
          headerText={t('AusweisChangePin.transportPinHeader')}
          descriptionText={t('AusweisChangePin.transportPinSubheader')}
          btnText={t('AusweisChangePin.transportPinBtn')}
          onPress={handleChange5DigPin}
        />
        <TitleDescAction
          headerText={t('AusweisChangePin.pinHeader')}
          descriptionText={t('AusweisChangePin.pinSubheader')}
          btnText={t('AusweisChangePin.pinBtn')}
          onPress={handleChange6DigPin}
        />
      </View>
      <TitleDescAction
        hasInlineBtn
        headerText={t('AusweisChangePin.forgotHeader')}
        descriptionText={t('AusweisChangePin.forgotSubheader')}
        btnText={t('AusweisChangePin.forgotBtn')}
        onPress={handlePreviewAuthorityInfo}
      />
    </ScreenContainer>
  )
}

export default AusweisChangePin
