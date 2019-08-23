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

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {
  currentWord: string
  mnemonic: string[]
  isValid: boolean
  wordList: string[]
  validWord: boolean
}

export class InputSeedPhraseContainer extends React.Component<Props, State> {
  private textInput: TextInput | undefined
  public state = {
    currentWord: '',
    validWord: false,
    isValid: false,
    wordList: [] as string[],
    mnemonic: [] as string[],
  }

  public componentDidMount(): void {
    if (this.textInput) this.textInput.focus()
  }

  private handleSeedPhraseChange = (text: string): void => {
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

  private onDoneButton = () => {
    const { wordList, currentWord } = this.state
    const matchingWord = wordList.find(e => e === currentWord.trim())
    if (matchingWord) {
      this.selectWord(matchingWord)
    } else if (wordList.length === 1) {
      this.selectWord(wordList[0])
    }
  }

  private selectWord = (word: string): void => {
    const { mnemonic } = this.state
    mnemonic.push(word)
    const mnemonicValid =
      mnemonic.length === 12 && validateMnemonic(mnemonic.join(' '))
    if (mnemonicValid && this.textInput) {
      this.textInput.blur()
    }
    this.setState({
      currentWord: '',
      validWord: false,
      mnemonic,
      isValid: mnemonicValid,
      wordList: [],
    })
  }

  public render(): JSX.Element {
    const { currentWord, validWord, mnemonic, isValid, wordList } = this.state
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
          handleTextInput={this.handleSeedPhraseChange}
          handleButtonPress={() => this.props.recoverIdentity(currentWord)}
          openKeyboard={ref => {
            this.textInput = ref
          }}
          handleDoneButton={this.onDoneButton}
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
