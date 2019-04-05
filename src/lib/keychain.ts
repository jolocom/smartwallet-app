import * as Keychain from 'react-native-keychain'

export interface KeyChainInterface {
  savePassword: (password: string) => Promise<void>
  getPassword: () => Promise<string>
}

export class KeyChain implements KeyChainInterface {
  private username = 'JolocomSmartWallet'
  private nativeLib = Keychain

  async savePassword(password: string): Promise<void> {
    await this.nativeLib.setGenericPassword(this.username, password)
  }

  async getPassword(): Promise<string> {
    const result = await this.nativeLib.getGenericPassword()

    if (typeof result === 'boolean') {
      throw new Error('Password could not be retrieved from the keychain')
    }

    return result.password
  }
}
