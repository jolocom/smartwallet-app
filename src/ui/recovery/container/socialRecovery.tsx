import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'react-native'
import { SocialRecoveryComponent } from '../components/socialRecovery'
import { RootState } from '../../../reducers'
import { deleteShard, openReceivedShards } from '../../../actions/recovery'
import { ShardEntity } from '../../../lib/storage/entities/shardEntity'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  modalOpen: boolean
  selectedShard?: ShardEntity
}

export class SocialRecoveryContainer extends React.Component<Props, State> {
  public state = {
    modalOpen: false,
    selectedShard: undefined,
  }

  private toggleModal = (shardId?: number) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedShard:
        shardId !== undefined ? this.props.shards[shardId] : undefined,
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
          shardsCreated={this.props.shardsCreated}
          toggleModal={this.toggleModal}
          openReceivedShards={this.props.openReceivedShards}
          deleteShard={this.props.deleteShard}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  shards: state.recovery.ownShards,
  shardsCreated: state.settings.shardsCreated,
})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openReceivedShards: () => dispatch(openReceivedShards()),
  deleteShard: (shard: ShardEntity) => dispatch(deleteShard(shard)),
})

export const SocialRecovery = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SocialRecoveryContainer)
