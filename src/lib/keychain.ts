import * as Keychain from 'react-native-keychain'

interface GetPasswordResponse {
  password: string;
  found: boolean;
}

export class KeyChain {
  private username = 'JolocomSmartWallet'
  private nativeLib : any = Keychain

  async savePassword(password: string) : Promise<void> {
    await this.nativeLib.setGenericPassword(this.username, password)
  }

  async getPassword() : Promise<GetPasswordResponse> {
    interface ExpectedResult {
      username: string;
      password: string;
      service: string;
    }

    const result = await this.nativeLib.getGenericPassword()

    if (typeof result === 'boolean') {
      return {
        found: false,
        password: ''
      }
    }

    return {
      found: true,
      password: (<ExpectedResult>result).password
    }
  }
}

