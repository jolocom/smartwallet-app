import * as React from 'react'
import RepeatSeedPhraseComponent from '../components/repeatSeedPhrase'
import { ThunkDispatch } from '../../../store'
import { navigationActions, recoveryActions } from '../../../actions'
import { connect } from 'react-redux'
import { withLoading } from '../../../actions/modifiers'
import { toggleLoading } from '../../../actions/account'

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: { state: { params: any } } // TODO Type?
}

interface State {
  note: string
  sorting: {}
  randomWords: string[]
}

class RepeatSeedPhraseContainer extends React.Component<Props, State> {
  public state = {
    note:
      'If you have noted down your phrase, put the six given words on their right places.',
    sorting: {},
    randomWords: [],
  }

  private selectPosition = (id: number) => {
    const { sorting, randomWords } = this.state
    if (sorting[id]) {
      randomWords.unshift(sorting[id] as never)
      delete sorting[id]
    } else {
      const currentWord: string = randomWords[0]
      randomWords.shift()
      sorting[id] = currentWord
    }

    this.setState({
      sorting,
      randomWords,
    })
  }

  private checkMnemonic = () => {
    const { sorting } = this.state
    const { mnemonic } = this.props.navigation.state.params
    let isCorrect = true
    const mnemonicArray = mnemonic.split(' ')
    Object.keys(sorting).forEach(key => {
      if (mnemonicArray[key] !== sorting[key]) {
        isCorrect = false
      }
    })

    if (isCorrect) {
      this.props.setSeedPhraseSaved()
    } else {
      this.setState({
        sorting: {},
        randomWords: Object.keys(sorting).map(key => sorting[key]),
        note:
          'The order was not correct. Try again with another six words from your secure phrase.',
      })
    }
  }

  public componentDidMount(): void {
    const randomWords = []
    const { mnemonic } = this.props.navigation.state.params
    const mnemonicArray = mnemonic.split(' ')
    while (randomWords.length < 6) {
      const random = Math.floor(Math.random() * mnemonicArray.length)
      if (randomWords.indexOf(mnemonicArray[random]) === -1) {
        randomWords.push(mnemonicArray[random])
      }
    }
    this.setState({ randomWords })
  }

  public render(): JSX.Element {
    const { back } = this.props
    const { note, sorting, randomWords } = this.state
    return (
      <RepeatSeedPhraseComponent
        note={note}
        mnemonicSorting={sorting}
        randomWords={randomWords}
        back={back}
        checkMnemonic={this.checkMnemonic}
        selectPosition={this.selectPosition}
      />
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  back: () => dispatch(navigationActions.goBack),
  setSeedPhraseSaved: () =>
    dispatch(withLoading(toggleLoading)(recoveryActions.setSeedPhraseSaved())),
})

export const RepeatSeedPhrase = connect(
  null,
  mapDispatchToProps,
)(RepeatSeedPhraseContainer)
