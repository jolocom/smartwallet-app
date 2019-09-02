import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import InputSeedPhraseComponent from '../components/inputSeedPhrase'
import { validateMnemonic, wordlists } from 'bip39'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { recoverIdentity } from '../../../actions/registration'
import { AppError } from '../../../lib/errors'
import { routeList } from '../../../routeList'
import ErrorCode from '../../../lib/errorCodes'
import { StatusBar, TextInput } from 'react-native'
import { timeout } from '../../../utils/asyncTimeout'

export enum WordState {
  editing,
  loading,
  valid,
  wrong,
}

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {
  currentWord: string
  mnemonic: string[]
  isValid: boolean
  wordList: string[]
  validWord: boolean
  markedWord: number
  wordState: WordState
}

export class InputSeedPhraseContainer extends React.Component<Props, State> {
  private textInput: TextInput | undefined
  public state = {
    currentWord: '',
    validWord: false,
    isValid: false,
    wordList: [] as string[],
    mnemonic: [] as string[],
    markedWord: 0, // editing first word
    wordState: WordState.editing,
  }

  public componentDidMount(): void {
    // if (this.textInput) this.textInput.focus()
  }

  private handleTextChange = (text: string): void => {
    let matches = [] as string[]
    if (text.length >= 2) {
      matches = wordlists.EN.filter((word: string): boolean =>
        word.startsWith(text.trim()),
      )
    }

    this.setState({
      validWord: matches.includes(text),
      currentWord: text,
      wordList: matches.slice(0, 10),
    })
  }

  private onDoneButton = async () => {
    const { wordList, currentWord } = this.state
    this.setState({
      wordState: WordState.loading,
    })
    await timeout(500)
    const matchingWord = wordList.find(e => e === currentWord.trim())

    if (matchingWord) {
      this.setState({
        wordState: WordState.valid,
      })
      await timeout(500)
      this.selectWord(matchingWord)
    } else {
      this.setState({
        wordState: WordState.wrong,
      })
    }
  }

  private selectWord = (word: string): void => {
    const { mnemonic, markedWord } = this.state
    const isLastWord = markedWord === mnemonic.length
    mnemonic[markedWord] = word
    const mnemonicValid =
      mnemonic.length === 12 && validateMnemonic(mnemonic.join(' '))
    if (mnemonicValid && this.textInput) {
      this.textInput.blur()
    }
    this.setState({
      currentWord: isLastWord ? '' : word,
      validWord: false,
      mnemonic,
      markedWord: isLastWord ? mnemonic.length : markedWord,
      isValid: mnemonicValid,
      wordList: [],
      wordState: WordState.editing,
    })
  }
  private previousWord = () => {
    const { markedWord, mnemonic, currentWord } = this.state
    let next = markedWord
    let inputValue = currentWord
    if (inputValue && currentWord !== mnemonic[markedWord]) inputValue = ''
    else {
      next = markedWord !== 0 ? markedWord - 1 : 0
      inputValue = next === mnemonic.length ? '' : mnemonic[next]
    }
    this.setState({
      currentWord: inputValue,
      markedWord: next,
    })
    this.handleTextChange(inputValue)
  }

  private nextWord = () => {
    const { markedWord, mnemonic, currentWord } = this.state
    let next = markedWord
    let inputValue = currentWord
    if (inputValue && currentWord !== mnemonic[markedWord]) inputValue = ''
    else {
      next = markedWord !== mnemonic.length ? markedWord + 1 : mnemonic.length
      inputValue = next === mnemonic.length ? '' : mnemonic[next]
    }
    this.setState({
      currentWord: inputValue,
      markedWord: next,
    })
    this.handleTextChange(inputValue)
  }

  public render(): JSX.Element {
    const {
      currentWord,
      validWord,
      mnemonic,
      isValid,
      wordList,
      markedWord,
      wordState,
    } = this.state
    return (
      <React.Fragment>
        <StatusBar />
        <InputSeedPhraseComponent
          currentWord={currentWord}
          validWord={validWord}
          mnemonic={mnemonic}
          isValid={isValid}
          wordList={wordList}
          selectWord={this.selectWord}
          handleTextInput={this.handleTextChange}
          handleButtonPress={() => this.props.recoverIdentity(currentWord)}
          openKeyboard={ref => {
            this.textInput = ref
          }}
          handleDoneButton={this.onDoneButton}
          handleNextWord={this.nextWord}
          handlePreviousWord={this.previousWord}
          markedWord={markedWord}
          wordState={wordState}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  recoverIdentity: (seedPhrase: string) =>
    dispatch(
      withErrorScreen(withLoading(recoverIdentity(seedPhrase)), err => {
        if (err instanceof AppError) {
          err.navigateTo = routeList.InputSeedPhrase
          return err
        }
        return new AppError(ErrorCode.Unknown, err)
      }),
    ),
})

export const InputSeedPhrase = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputSeedPhraseContainer)
