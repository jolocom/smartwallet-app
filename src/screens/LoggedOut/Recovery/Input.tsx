import React, { useState } from 'react'
import { TextInput, StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'

const Input = () => {
  const [currentSeedWord, setCurrentSeedWord] = useState('')
  return (
    <View style={styles.inputContainer}>
      <TextInput
        underlineColorAndroid="transparent"
        style={styles.input}
        value={currentSeedWord}
        onChangeText={setCurrentSeedWord}
        textAlign="center"
        spellCheck={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    backgroundColor: 'black',
    height: 80,
    borderRadius: 7,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  input: {
    fontSize: 34,
    width: '70%',
    color: Colors.white,
    borderWidth: 2,
    textDecorationLine: 'none',
  },
})

export default Input
