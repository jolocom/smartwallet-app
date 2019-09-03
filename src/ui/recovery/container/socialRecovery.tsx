import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'react-native'
import { SocialRecoveryComponent } from '../components/socialRecovery'
import { RootState } from '../../../reducers'
import { openReceivedShards } from '../../../actions/recovery'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  modalOpen: boolean
  selectedShard: string
}

export class SocialRecoveryContainer extends React.Component<Props, State> {
  public state = {
    modalOpen: false,
    selectedShard: '',
  }

  private toggleModal = (shardId?: number) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedShard: shardId !== undefined ? this.props.shards[shardId] : '',
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
          shards={this.props.shards}
          modalOpen={modalOpen}
          selectedShard={selectedShard}
          toggleModal={this.toggleModal}
          openReceivedShards={this.props.openReceivedShards}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  shards: state.recovery.ownShards,
})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openReceivedShards: () => dispatch(openReceivedShards()),
})

export const SocialRecovery = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SocialRecoveryContainer)
