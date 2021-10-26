import { useIsFocused } from '@react-navigation/core'
import React, { useEffect, useMemo } from 'react'
import { Platform, View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { usePrevious } from '~/hooks/generic'

import { ScreenNames } from '~/types/screens'

import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

import { AusweisPasscodeMode, eIDScreens } from '../types'

interface WhateverProps {
  headerText: string
  descriptionText: string
  hasInlineBtn?: boolean
  btnText: string
  onPress: () => void
}
/**
 * TODO: find a better name for
 * this component
 */
const WhateverComponent: React.FC<WhateverProps> = ({
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
              ...find more
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

const AusweisChangePin = ({ navigation }) => {
  const isFocused = useIsFocused()
  const prevIsFocused = usePrevious(isFocused)

  const handlers = useMemo(
    () => ({
      handlePinRequest: () => {
        navigation.navigate(ScreenNames.eId, {
          screen: eIDScreens.EnterPIN,
          params: {
            mode: AusweisPasscodeMode.PIN,
          },
        })
      },
      handleCanRequest: () => {
        navigation.navigate(ScreenNames.eId, {
          screen: eIDScreens.EnterPIN,
          params: {
            mode: AusweisPasscodeMode.CAN,
          },
        })
      },
      handlePukRequest: () => {
        navigation.navigate(
          ScreenNames.eId,
          {
            screen: eIDScreens.EnterPIN,
            params: {
              mode: AusweisPasscodeMode.PUK,
            },
          },
          {},
        )
      },
      handleCardRequest: () => {
        if (Platform.OS === 'android') {
          navigation.navigate(ScreenNames.eId, {
            screen: eIDScreens.AusweisScanner,
            params: {
              onDismiss: () => {
                aa2Module.cancelFlow()
              },
            },
          })
        }
      },
    }),
    [],
  )

  useEffect(() => {
    if (isFocused === true && prevIsFocused === false) {
      aa2Module.setHandlers(handlers)
    }
  }, [isFocused])

  useEffect(() => {
    aa2Module.resetHandlers()
    aa2Module.setHandlers(handlers)
  }, [])

  const handleChange5DigPin = () => {
    console.warn('not implemented')
  }
  const handleChange6DigPin = () => {
    aa2Module.changePin()
  }
  /**
   * TODO: update the name of the fn
   * after figuring out where it should navigate
   */
  const handleOther = () => {
    console.warn('not implemented')
  }

  return (
    <ScreenContainer
      hasHeaderBack
      navigationStyles={{ backgroundColor: Colors.mainBlack }}
      customStyles={{ justifyContent: 'space-around' }}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <WhateverComponent
          headerText="Do you have 5-digit PIN?"
          descriptionText="You should have received it with the letter together with your card"
          btnText="Start the process"
          onPress={handleChange5DigPin}
        />
        <WhateverComponent
          headerText="Activate your 6-digit PIN code"
          descriptionText="You can find it in the bottom right corner on the front side of your ID card"
          btnText="Start the process"
          onPress={handleChange6DigPin}
        />
      </View>
      <WhateverComponent
        hasInlineBtn
        headerText="Can’t find any of this?"
        descriptionText="If you completely forgot your PIN and can not find your PIN letter, please turn to the competent authority"
        btnText="find more"
        onPress={handleOther}
      />
    </ScreenContainer>
  )
}

export default AusweisChangePin
