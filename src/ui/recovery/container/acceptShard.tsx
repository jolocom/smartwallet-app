import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'react-native'
import { AcceptShardComponent } from '../components/acceptShard'
import { saveReceivedShard } from '../../../actions/recovery'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  label: string
}

export class AcceptShardContainer extends React.Component<Props, State> {
  public state = {
    label: '',
  }

  private onLabelChange = (newValue: string) => {
    this.setState({
      label: newValue,
    })
  }

  public render() {
    return (
      <React.Fragment>
        <StatusBar
          animated={false}
          barStyle="light-content"
          showHideTransition="fade"
        />
        <AcceptShardComponent
          handleLabelChange={this.onLabelChange}
          label={this.state.label}
          acceptShard={() =>
            this.props.saveShard(
              this.props.navigation.getParam('shard'),
              this.state.label,
            )
          }
          cancelReceiving={() => {}}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  saveShard: (shard: string, label: string) =>
    dispatch(saveReceivedShard(shard, label)),
})

export const AcceptShard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AcceptShardContainer)
