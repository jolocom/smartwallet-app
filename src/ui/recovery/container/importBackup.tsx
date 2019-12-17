import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { recoverIdentity } from '../../../actions/registration'
import { RootState } from '../../../reducers'
import {
  EncryptedData,
  EncryptedKey,
} from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { Text } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { readFile } from 'react-native-fs'
import { publicKeyToDID } from 'jolocom-lib/js/utils/crypto'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {
  error: string
}
export class ImportBackupContainer extends React.Component<Props, State> {
  public state = {
    error: '',
  }
  private getBackupFile = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.plainText],
    })
    const importedData = await readFile(res.uri)

    const encryptedBackup = this.validateImport(importedData)
    if (encryptedBackup) {
      this.props.recoverIdentity(encryptedBackup)
    }
  }

  private validateImport = (
    importedData: string,
  ): EncryptedData | undefined => {
    try {
      const encryptedBackup = JSON.parse(importedData)
      const publicKeys = encryptedBackup['keys'].map(
        (e: EncryptedKey) => e.pubKey,
      )
      // check if a publicKey is matching the current identity
      if (
        publicKeys.find(
          (key: string) =>
            publicKeyToDID(Buffer.from(key, 'hex')) === this.props.did,
        )
      ) {
        return encryptedBackup
      }
      this.setError('Wrong backup file, not related to the recovered identity')
      return
    } catch (e) {
      this.setError(e.message)
      return
    }
  }

  private setError = (error: string) => {
    this.setState({ error })
  }

  public render(): JSX.Element {
    const { error } = this.state

    return (
      <React.Fragment>
        <Text onPress={this.getBackupFile}>Import Backup</Text>
        <Text>{error}</Text>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  did: state.account.did.did,
})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  recoverIdentity: (encryptedBackup: EncryptedData) =>
    dispatch(withLoading(withErrorScreen(recoverIdentity(encryptedBackup)))),
})

export const ImportBackup = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportBackupContainer)
