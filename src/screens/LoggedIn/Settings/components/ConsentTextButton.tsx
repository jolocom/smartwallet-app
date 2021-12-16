import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

interface Props {
  text: string
  onPress: () => void
}

//TODO: very similar to ConsentText. Could be abstracted
const ConsentButton: React.FC<Props> = ({ onPress, text, children }) => {
  return (
    <TouchableOpacity style={styles.consentButton} onPress={onPress}>
      <JoloText
        color={Colors.purple}
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
      >
        {text}
      </JoloText>
      {children && children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  consentButton: {
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginVertical: BP({ xsmall: 6, small: 6, default: 10 }),
  },
})

export default ConsentButton
