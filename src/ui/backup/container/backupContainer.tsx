import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import BackupComponent from '../components/backupComponent'
import { RootState } from '../../../reducers'
import {
  disableAndRemoveBackup,
  setAutoBackup,
} from '../../../actions/recovery'
import { timeout } from '../../../utils/asyncTimeout'
import { NavigationScreenProps } from 'react-navigation'
import { Alert } from 'react-native'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {
  isLoading: boolean
}

export class BackupContainer extends React.Component<Props, State> {
  state = {
    isLoading: false,
  }

  private toggleLoading = () => {
    this.setState({ isLoading: !this.state.isLoading })
  }

  private enableAutoBackup = async () => {
    this.toggleLoading()
    await timeout(500)
    try {
      await this.props.enableAutoBackup()
    } catch (e) {
      // TODO show notification
      console.warn(e)
    } finally {
      this.toggleLoading()
    }
  }

  private onDisableAutoBackup = async () => {
    Alert.alert(
      'Are you sure?',
      'By disabling this function you will erase all information from our server',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', style: 'default', onPress: this.disableAutoBackup },
      ],
    )
  }

  private disableAutoBackup = async () => {
    this.toggleLoading()
    await timeout(500)
    try {
      await this.props.disableAutoBackupAndDelete()
    } catch (e) {
      // TODO show notification
      console.warn(e)
    } finally {
      this.toggleLoading()
    }
  }

  public render() {
    const { isAutoBackupEnabled, navigation } = this.props
    const { isLoading } = this.state
    return (
      <BackupComponent
        isLoading={isLoading}
        onDisableAutoBackup={this.onDisableAutoBackup}
        isAutoBackupEnabled={isAutoBackupEnabled}
        enableAutoBackup={this.enableAutoBackup}
        goBack={() => navigation.pop()}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  isAutoBackupEnabled: state.settings.autoBackup,
})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  enableAutoBackup: async () => await dispatch(setAutoBackup(true)),
  disableAutoBackupAndDelete: () => dispatch(disableAndRemoveBackup()),
})

export const Backup = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackupContainer)
