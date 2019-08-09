import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import InputSeedPhraseComponent from '../components/inputSeedPhrase'
// @ts-ignore
import { wordlists } from 'bip39'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {
  value: string
  wordList: string[]
}
function getLastWord(phrase: string): string {
  phrase = phrase.trim()
  if (phrase.indexOf(' ') !== -1) {
    return phrase
      .slice(phrase.lastIndexOf(' '), phrase.length)
      .trim()
      .toLowerCase()
  } else return phrase.toLowerCase()
}
export class InputSeedPhraseContainer extends React.Component<Props, State> {
  public state = {
    value: '',
    wordList: [] as string[],
  }

  private handleSeedPhraseChange = (text: string): void => {
    const lastWord = getLastWord(text)
    let matches = []
    console.log(lastWord)
    if (lastWord.length >= 3) {
      matches = wordlists.EN.filter(
        (word: string): boolean =>
          word.startsWith(lastWord) && word !== lastWord,
      )
    }
    this.setState({
      value: text,
      wordList: matches,
    })
  }

  private selectWord = (index: number): void => {
    const { wordList, value } = this.state
    this.setState({
      value:
        value.indexOf(' ') !== -1
          ? value.slice(0, value.lastIndexOf(' ')) + ' ' + wordList[index] + ' '
          : wordList[index] + ' ',
      wordList: [],
    })
  }
  public render(): JSX.Element {
    return (
      <InputSeedPhraseComponent
        value={this.state.value}
        wordList={this.state.wordList}
        selectWord={this.selectWord}
        handleTextInput={this.handleSeedPhraseChange}
      />
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({})

export const InputSeedPhrase = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputSeedPhraseContainer)
