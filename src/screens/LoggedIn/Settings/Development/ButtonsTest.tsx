import React, { useState } from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { ScrollView, View } from 'react-native'
import ToggleSwitch from '~/components/ToggleSwitch'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'

const ButtonsTest = () => {
  const [isLarge, setLarge] = useState(false)

  const handleToggle = () => {
    setLarge((prev) => !prev)
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView>
        <JoloText
          kind={JoloTextKind.title}
          customStyles={{ alignSelf: 'flex-start' }}
        >
          Buttons
        </JoloText>
        <View
          style={{
            marginVertical: 40,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            borderColor: Colors.white40,
            paddingBottom: 30,
            borderBottomWidth: 1,
          }}
        >
          <JoloText>Medium</JoloText>
          <ToggleSwitch on={isLarge} onToggle={handleToggle} />
          <JoloText>Large</JoloText>
        </View>
        {Object.values(BtnTypes).map((btn) => (
          <Btn
            key={randomNumber}
            type={btn}
            size={isLarge ? BtnSize.large : BtnSize.medium}
            onPress={() => {}}
          >
            {btn}
          </Btn>
        ))}
      </ScrollView>
    </ScreenContainer>
  )
}

export default ButtonsTest
