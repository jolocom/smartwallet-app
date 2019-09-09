import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'react-native'
import { RootState } from '../../../../reducers'
import { initSocialRecovery } from '../../../../actions/recovery'
import { InitSocialRecoveryComponent } from '../components/initSocialRecovery'
import { withLoading } from '../../../../actions/modifiers'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  amount: number
  threshold: number
}

export class InitSocialRecoveryContainer extends React.Component<Props, State> {
  public state = {
    amount: 5,
    threshold: 3,
  }

  private onAmountChange = (value: string) => {
    const parsed = Number(value)
    if (value == '' || (Number.isInteger(parsed) && parsed > 0)) {
      this.setState({
        amount: parsed,
      })
    }
  }

  private onThresholdChange = (value: string) => {
    const parsed = Number(value)
    if (value == '' || (Number.isInteger(parsed) && parsed > 0)) {
      this.setState({
        threshold: parsed,
      })
    }
  }

  public render() {
    const { amount, threshold } = this.state
    return (
      <React.Fragment>
        <StatusBar
          animated={false}
          barStyle="light-content"
          showHideTransition="fade"
        />
        <InitSocialRecoveryComponent
          amountOfShards={amount}
          threshold={threshold}
          shardEntropy={() => this.props.initSocialRecovery(amount, threshold)}
          onAmountChange={this.onAmountChange}
          onThresholdChange={this.onThresholdChange}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  initSocialRecovery: (amount: number, threshold: number) =>
    dispatch(withLoading(initSocialRecovery(amount, threshold))),
})

export const InitSocialRecovery = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitSocialRecoveryContainer)
