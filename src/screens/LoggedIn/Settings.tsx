import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'
import { View, Switch, ScrollView } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import useResetKeychainValues from '~/hooks/useResetKeychainValues'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations/strings'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { accountReset } from '~/modules/account/actions'
import CredentialCard from '../Modals/Interactions/CredentialCard'
import { Colors } from '~/utils/colors'
import Carousel from '../Modals/Interactions/Carousel'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

interface SwitcherPropsI {
  value: boolean
  onValueChange: Dispatch<SetStateAction<boolean>>
  leftTitle: string
  rightTitle: string
}
const Switcher: React.FC<SwitcherPropsI> = ({
  value,
  onValueChange,
  leftTitle,
  rightTitle,
}) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        customStyles={{ marginRight: 10 }}
      >
        {leftTitle}
      </JoloText>
      <Switch value={value} onValueChange={onValueChange} />
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        customStyles={{ marginLeft: 10 }}
      >
        {rightTitle}
      </JoloText>
    </View>
  )
}

const CARDS = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]

const Settings = () => {
  const [isSmall, setIsSmall] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true)
  const [selectedCard, setSelectedCard] = useState('')
  const [instructionVisible, setInstructionVisibility] = useState(true)

  const redirectToChangePin = useRedirectTo(ScreenNames.SettingsList, {
    screen: ScreenNames.ChangePin,
  })
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const dispatch = useDispatch()

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('biometry')
      resetServiceValuesInKeychain()
      dispatch(accountReset())
    } catch (err) {
      console.log('Error occured while logging out')
      console.warn({ err })
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedCard(selectedCard === id ? '' : id)
    console.log('Selecting card')
  }

  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined = undefined
    if (!selectedCard) {
      id = setTimeout(() => {
        setInstructionVisibility(false)
      }, 5000)
    } else if (id && selectedCard) {
      setInstructionVisibility(false)
      clearTimeout(id)
    }

    return () => {
      id && clearTimeout(id)
    }
  }, [selectedCard])

  return (
    <ScreenContainer>
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Switcher
            value={isSmall}
            onValueChange={setIsSmall}
            leftTitle="Large"
            rightTitle="Small"
          />
          <Switcher
            value={isDisabled}
            onValueChange={setIsDisabled}
            leftTitle="Active"
            rightTitle="Disabled"
          />
          <Carousel>
            {CARDS.map((card, idx) => (
              <CredentialCard
                isSmall={true}
                selected={card.id === selectedCard}
                onSelect={() => handleToggleSelect(card.id)}
                hasInstruction={
                  instructionVisible && idx === 0 && !selectedCard
                }
              >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <JoloText
                    kind={JoloTextKind.subtitle}
                    size={JoloTextSizes.middle}
                    color={Colors.black}
                  >
                    This is a custom card content
                  </JoloText>
                </View>
              </CredentialCard>
            ))}
          </Carousel>
        </View>

        <Btn onPress={redirectToChangePin}>{strings.CHANGE_PIN}</Btn>
        <Btn onPress={logout}>{strings.LOG_OUT}</Btn>
      </ScrollView>
    </ScreenContainer>
  )
}

export default Settings
