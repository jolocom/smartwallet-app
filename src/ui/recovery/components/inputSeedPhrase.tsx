import * as React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Container, JolocomButton } from '../../structure'
import { JolocomTheme } from '../../../styles/jolocom-theme.android'
import { Button } from 'react-native-material-ui'
import {
  buttonStandardContainer,
  buttonStandardText,
} from '../../../styles/buttons'
import { largeText, noteText } from '../../../styles/typography'
import { Colors } from '../../../styles'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  header: {
    ...largeText,
    color: 'white',
    margin: 20,
  },
  note: {
    ...noteText,
    textAlign: 'center',
    lineHeight: 26,
    margin: 22,
  },
  mnemonicSection: {},
  textInput: {
    width: '70%',
    fontSize: 38,
  },
  correct: {
    color: 'white',
  },
  error: {
    color: Colors.purpleMain,
  },
  disabled: {
    opacity: 0.5,
  },
})
interface InputSeedPhraseProps {
  handleButtonPress: () => void
  handleTextInput: (text: string) => void
  selectWord: (word: string) => void
  openKeyboard: (ref: TextInput) => void
  handleDoneButton: () => void
  mnemonic: string[]
  currentWord: string
  isValid: boolean
  wordList: string[]
  validWord: boolean
  markedWord: number
  handleNextWord: () => void
  handlePreviousWord: () => void
}
const InputSeedPhraseComponent: React.FC<InputSeedPhraseProps> = ({
  currentWord,
  markedWord,
  wordList,
  isValid,
  validWord,
  mnemonic,
  handleTextInput,
  selectWord,
  handleButtonPress,
  openKeyboard,
  handleDoneButton,
  handleNextWord,
  handlePreviousWord,
}) => {
  const canBeValid = wordList.length > 0 || currentWord.length < 2
  const isPreviousEnabled = markedWord > 0 || currentWord.length > 0
  const isNextEnabled = markedWord < mnemonic.length
  return (
    <Container style={styles.container}>
      <Text style={styles.header}>
        {mnemonic.length === 0 ? 'Recovery' : mnemonic.length + '/12 completed'}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 150,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {mnemonic.length === 0 ? (
          <Text style={styles.note}>
            Start writing your seed-phrase and it will appears here word by word
          </Text>
        ) : (
          mnemonic.map((word: string, i: number) => (
            <Text
              style={[
                styles.note,
                { margin: 2, fontSize: 30 },
                markedWord === i && { color: Colors.purpleMain },
              ]}
            >
              {word}
            </Text>
          ))
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name={'arrow-left'}
          color={isPreviousEnabled ? 'white' : 'black'}
          size={25}
          onPress={isPreviousEnabled ? handlePreviousWord : undefined}
        />
        {
          //@ts-ignore textAlign is missing in the typings of TextInput
          <TextInput
            textAlign={'center'}
            ref={openKeyboard}
            autoFocus
            autoCapitalize={'none'}
            style={[
              styles.textInput,
              canBeValid ? styles.correct : styles.error,
            ]}
            value={currentWord}
            onChangeText={handleTextInput}
            underlineColorAndroid={Colors.sandLight}
            returnKeyLabel={'Done'}
            returnKeyType={'next'}
            selectionColor={Colors.purpleMain}
            blurOnSubmit={false}
            onSubmitEditing={handleDoneButton}
          />
        }
        <Icon
          name={'arrow-right'}
          color={isNextEnabled ? 'white' : 'black'}
          size={25}
          onPress={isNextEnabled ? handleNextWord : undefined}
        />
      </View>
      <Text style={{ color: 'white', fontSize: 18 }}>
        {wordList.length > 0 && 'Choose the right word or press enter'}
        {!canBeValid && 'The word is not correct, check for typos'}
        {''}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          position: 'relative',
          height: 40,
          width: '100%',
        }}
      >
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            left: 0,
            flexWrap: 'nowrap',
            width: '100%',
            // margin: 12,
          }}
        >
          {canBeValid &&
            wordList.map((word, i) => (
              <Button
                key={i}
                text={word}
                onPress={() => selectWord(wordList[i])}
                upperCase={false}
                style={{
                  container: {
                    ...buttonStandardContainer,
                    minWidth: 0,
                    margin: 6,
                  },
                  text: { ...buttonStandardText },
                }}
              />
            ))}
        </View>
      </View>
      {isValid && (
        <React.Fragment>
          <Text style={styles.note}>Valid</Text>
          <JolocomButton
            disabled={!isValid}
            onPress={isValid ? handleButtonPress : undefined}
            raised
            upperCase={false}
            text={'Recover my Identity'}
          />
        </React.Fragment>
      )}
    </Container>
  )
}

export default InputSeedPhraseComponent
