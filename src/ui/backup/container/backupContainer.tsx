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

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

export type ModalType = 'auto-backup' | 'delete-backup' | 'prepare'
interface State {
  isModalOpen: boolean
  isLoading: boolean
  modalType: ModalType
}

export class BackupContainer extends React.Component<Props, State> {
  state = {
    isModalOpen: false,
    isLoading: false,
    modalType: 'auto-backup' as ModalType,
  }
  private toggleModal = (isLoading: boolean, modalType?: ModalType) => {
    console.log('toggleModal')
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      isLoading: isLoading,
      modalType: modalType || 'auto-backup',
    })
  }

  private enableAutoBackup = async () => {
    this.toggleModal(true, 'auto-backup')
    await timeout(1500)
    await this.props.enableAutoBackup()
    this.toggleModal(false)
  }

  private toggleDeleteModal = async () => {
    this.toggleModal(false, 'delete-backup')
  }

  private disableAutoBackup = async () => {
    this.setState({ isLoading: true })
    await timeout(1000)
    await this.props.disableAutoBackupAndDelete()
    this.toggleModal(true, 'delete-backup')
  }

  public render() {
    const { isAutoBackupEnabled, navigation } = this.props
    const { isLoading, modalType, isModalOpen } = this.state
    return (
      <BackupComponent
        modalType={modalType}
        isLoading={isLoading}
        isModalOpen={isModalOpen}
        toggleDeleteModal={this.toggleDeleteModal}
        isAutoBackupEnabled={isAutoBackupEnabled}
        enableAutoBackup={this.enableAutoBackup}
        disableAutoBackupAndDelete={this.disableAutoBackup}
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
