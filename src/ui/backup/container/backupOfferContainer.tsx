import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { manualBackup, setAutoBackup } from '../../../actions/recovery'
import { NavigationScreenProps } from 'react-navigation'
import BackupOfferComponent from '../components/backupOfferComponent'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { withLoading } from '../../../actions/modifiers'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

export class BackupOfferContainer extends React.Component<Props> {
  private manualBackup = async () => {
    await this.props.manualBackup()
    this.props.close()
  }
  public render() {
    const { close, enableAutoBackup } = this.props
    return (
      <BackupOfferComponent
        close={close}
        enableAutoBackup={enableAutoBackup}
        manualBackup={this.manualBackup}
      />
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => {
  return {
    enableAutoBackup: async () => {
      await dispatch(withLoading(setAutoBackup(true)))
      dispatch(navigationActions.navigate({ routeName: routeList.Settings }))
    },
    manualBackup: async () => await dispatch(manualBackup()),
    close: () =>
      dispatch(navigationActions.navigate({ routeName: routeList.Settings })),
  }
}

export const BackupOffer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackupOfferContainer)
