import { KeyChain } from 'src/lib/keychain'

describe('KeyChain lib', () => {
  let KC

  beforeEach(() => {
    KC = new KeyChain()
  })

  it('should contain the correct username', () => {
    expect(KC.username).toBe('JolocomSmartWallet')
    expect(KC.nativeLib).toBeDefined()
  })

  it('should correctly save the password', async () => {
    const mockSetGenericPassword = jest.fn()
    KC.nativeLib.setGenericPassword = mockSetGenericPassword

    await KC.savePassword('test')

    expect(mockSetGenericPassword.mock.calls).toMatchSnapshot()
  })

  it('should correctly return if saving the password failed', async () => {
    KC.nativeLib.setGenericPassword = async () => {
      throw new Error('scary error')
    }

    let error

    try {
      await KC.savePassword('test')
    } catch (err) {
      error = err
    }

    expect(error).toEqual(new Error('scary error'))
  })

  it('should correctly retrieve password', async () => {
    KC.nativeLib.getGenericPassword = jest.fn().mockReturnValue({
      username: 'JolocomSmartWallet',
      password: 'test',
    })

    const result = await KC.getPassword()
    expect(result).toEqual('test')
  })

  it('should correctly return if password retrieval failed', async () => {
    KC.nativeLib.getGenericPassword = jest.fn().mockReturnValue(false)

    let error

    try {
      await KC.getPassword()
    } catch (err) {
      error = err
    }
    expect(error).toEqual(
      new Error('Password could not be retrieved from the keychain'),
    )
  })
})
