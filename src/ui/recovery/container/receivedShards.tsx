import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'react-native'
import { ReceivedShardsComponent } from '../components/receivedShards'
import { ShardModal } from '../components/shardModal'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  modalOpen: boolean
  selectedShard?: LabeledShard
}

export interface LabeledShard {
  label: string
  value: string
}

const shards: LabeledShard[] = [
  { label: 'Max', value: 'ajsdgjasgdjasgdjsmgajsdgjasgd' },
  {
    label: 'Peter',
    value: 'ajsdgjasgdjasgdjsmgajsdgjasgakjsdgaugdkjasgdjgasdg',
  },
]
export class ReceivedShardsContainer extends React.Component<Props, State> {
  public state = {
    modalOpen: false,
    selectedShard: undefined,
  }

  private toggleModal = (shardId?: number) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedShard: shardId !== undefined ? shards[shardId] : undefined,
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
          shards={shards}
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

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({})

export const ReceivedShards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceivedShardsContainer)
