import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import Block from '~/components/Block'

import { strings } from '~/translations/strings'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

interface IProps {
  input: string
  setInput: (value: string) => void
}

const TextArea: React.FC<IProps> = ({ input, setInput }) => {
  return (
    <Block customStyle={{ padding: 13 }}>
      <TextInput
        placeholder={`${strings.TAP_TO_WRITE}...`}
        placeholderTextColor={Colors.white70}
        value={input}
        onChangeText={setInput}
        multiline
        style={styles.inputStyle}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  inputStyle: {
    color: Colors.white,
    height: BP({ default: 196, small: 150, xsmall: 150 }),
    textAlignVertical: 'top',
  },
})

export default TextArea
