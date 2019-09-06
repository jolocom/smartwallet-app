import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { Alert, StatusBar } from 'react-native'
import { CollectShardsComponent } from '../components/collectShards'
import { SocialRecovery } from 'jolocom-lib/js/recovery/socialRecovery'
import {
  loadOwnShards,
  recoverIdentity,
  storeShard,
} from '../../../../actions/recovery'
import { RootState } from '../../../../reducers'
import { withLoading } from '../../../../actions/modifiers'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  cameraOpen: boolean
}

export class CollectShardsContainer extends React.Component<Props, State> {
  public state = {
    cameraOpen: false,
  }

  public componentDidMount(): void {
    this.props.loadShards()
  }

  private toggleCamera = () => {
    this.setState({
      cameraOpen: !this.state.cameraOpen,
    })
  }

  private handleScanResult = async (e: Event) => {
    const shardPrefix = 'shard:'
    //@ts-ignore
    const data = e.data
    const shardData = data.slice(shardPrefix.length)
    if (
      data.startsWith(shardPrefix) &&
      SocialRecovery.validateShard(shardData)
    ) {
      if (this.props.shards.find(s => s.value === shardData)) {
        this.toggleCamera()
        Alert.alert('This shard was already collected')
        return
      }
      await this.props.storeShard(shardData)
      this.toggleCamera()
      try {
        const {secret, did} = SocialRecovery.combineShard(
          this.props.shards.map(s => s.value),
        )
        this.props.recoverIdentity(secret, did)
        this.toggleCamera()
      } catch (e) {
        console.log('not finished yet')
      }
    } else {
      this.toggleCamera()
      Alert.alert('Something when wrong please try again')
    }
  }

  public render() {
    return (
      <React.Fragment>
        <StatusBar
          animated={false}
          barStyle="light-content"
          showHideTransition="fade"
        />
        <CollectShardsComponent
          shards={this.props.shards}
          openCamera={this.toggleCamera}
          cameraOpen={this.state.cameraOpen}
          onScan={this.handleScanResult}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  shards: state.recovery.ownShards,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  loadShards: () => dispatch(loadOwnShards()),
  storeShard: (shard: string) => dispatch(storeShard(shard)),
  recoverIdentity: (entropy: string, did: string) => dispatch(withLoading(recoverIdentity(entropy, did))),
})

export const CollectShards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CollectShardsContainer)
