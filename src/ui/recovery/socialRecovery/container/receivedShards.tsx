import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'react-native'
import { ReceivedShardsComponent } from '../components/receivedShards'
import { ShardModal } from '../components/shardModal'
import { RootState } from '../../../../reducers'
import { ShardEntity } from '../../../../lib/storage/entities/shardEntity'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  modalOpen: boolean
  selectedShard?: ShardEntity
}

export class ReceivedShardsContainer extends React.Component<Props, State> {
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
        <ReceivedShardsComponent
          toggleModal={this.toggleModal}
          shards={this.props.shards}
        />
        {selectedShard && (
          <ShardModal
            closeModal={this.toggleModal}
            modalOpen={modalOpen}
            //@ts-ignore
            selectedShard={selectedShard}
          />
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  shards: state.recovery.receivedShards,
})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({})

export const ReceivedShards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceivedShardsContainer)
