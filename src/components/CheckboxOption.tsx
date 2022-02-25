import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { PurpleTickSuccess } from '~/assets/svg'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText from './JoloText'
import BP from '~/utils/breakpoints'

interface Props {
  onPress: (selected: boolean) => void
  description: string
}

export const CheckboxOption: React.FC<Props> = ({ onPress, description }) => {
  const [selected, setSelected] = useState(false)

  const handlePress = () => {
    onPress(!selected)
    setSelected((prev) => !prev)
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handlePress}
      testID="checkbox-option"
    >
      <View style={styles.radio}>{selected && <PurpleTickSuccess />}</View>
      <JoloText
        size={JoloTextSizes.mini}
        color={Colors.white90}
        customStyles={{ textAlign: 'left', paddingRight: 24 }}
      >
        {description}
      </JoloText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9,
    paddingTop: BP({ large: 20, default: 16 }),
    paddingBottom: BP({ large: 18, default: 14 }),
    paddingHorizontal: 24,
    backgroundColor: Colors.grey2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 28,
    height: 28,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.mainDark,
    borderRadius: 14,
  },
})
