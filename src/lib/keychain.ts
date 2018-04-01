import * as Keychain from 'react-native-keychain'

interface getPasswordResponse {
  password: string;
  found: boolean;
}

export class KeyChain {
  private username = 'JolocomSmartWallet'

  async savePassword(password: string) : Promise<boolean> {
    try {
      await Keychain.setGenericPassword(this.username, password)
      return true
    } catch (err) {
      return false
    }
  }

  async getPassword() : Promise<getPasswordResponse> {
    interface expectedResult {
      username: string;
      password: string;
      service: string;
    }

    const result = await Keychain.getGenericPassword()

    if (typeof result === 'boolean') {
      return {
        found: false,
        password: ''
      }
    }

    return {
      found: true,
      password: (<expectedResult>result).password
    }
  }
}

