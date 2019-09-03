import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { StatusBar } from 'react-native'
import { SocialRecoveryComponent } from '../components/socialRecovery'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  modalOpen: boolean
  selectedShard: string
}

const shrads = [
  'kashdlkasgdaldkhaöksdhasködhaödshöaskhdaökashdkashdas',
  'aksljdgalsjgfluehuvagwk jdgajkcefcahgfckacjkdgaksjdsg',
]
export class SocialRecoveryContainer extends React.Component<Props, State> {
  public state = {
    modalOpen: false,
    selectedShard: '',
  }

  private toggleModal = (shardId?: number) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedShard: shardId !== undefined ? shrads[shardId] : '',
    })
  }
  public render() {
    const { modalOpen, selectedShard } = this.state
    return (
      <React.Fragment>
        <StatusBar
          animated={false}
          barStyle="light-content"
          showHideTransition="fade"
        />
        <SocialRecoveryComponent
          shards={shrads}
          modalOpen={modalOpen}
          selectedShard={selectedShard}
          toggleModal={this.toggleModal}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  repeatSeedPhrase: (mnemonic: string) =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.RepeatSeedPhrase,
        params: { mnemonic },
      }),
    ),
})

export const SocialRecovery = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SocialRecoveryContainer)
