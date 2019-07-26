import * as React from 'react'
import RepeatSeedPhraseComponent from '../components/repeatSeedPhrase'
import { ThunkDispatch } from '../../../store'
import { recoveryActions } from '../../../actions'
import { connect } from 'react-redux'
import { withLoading } from '../../../actions/modifiers'
import { toggleLoading } from '../../../actions/account'
import strings from '../../../locales/strings'
import * as I18n from 'i18n-js'
import { NavigationScreenProps } from 'react-navigation'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    NavigationScreenProps {}

interface State {
  note: string
  sorting: {}
  randomWords: string[]
}

class RepeatSeedPhraseContainer extends React.Component<Props, State> {
  public state = {
    note: I18n.t(
      strings.IF_YOU_HAVE_NOTED_DOWN_YOUR_PHRASE_PUT_THE_SIX_GIVEN_WORDS_ON_THEIR_RIGHT_PLACES,
    ),
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
    const mnemonic = this.props.navigation.getParam('mnemonic')
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
        note: I18n.t(
          strings.THE_ORDER_WAS_NOT_CORRECT_TRY_AGAIN_WITH_ANOTHER_SIX_WORDS_FROM_YOUR_SECURE_PHRASE,
        ),
      })
    }
  }

  public componentDidMount(): void {
    const randomWords = []
    const mnemonic = this.props.navigation.getParam('mnemonic')
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
    const { note, sorting, randomWords } = this.state
    return (
      <RepeatSeedPhraseComponent
        note={note}
        mnemonicSorting={sorting}
        randomWords={randomWords}
        back={() => this.props.navigation.goBack()}
        checkMnemonic={this.checkMnemonic}
        selectPosition={this.selectPosition}
      />
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setSeedPhraseSaved: () =>
    dispatch(withLoading(toggleLoading)(recoveryActions.setSeedPhraseSaved())),
})

export const RepeatSeedPhrase = connect(
  null,
  mapDispatchToProps,
)(RepeatSeedPhraseContainer)
