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

    const result = await KC.savePassword('test')
    expect(result).toBe(true)
    expect(mockSetGenericPassword.mock.calls).toEqual([
      ["JolocomSmartWallet", "test"]
    ])
  })

  it('should correctly return if saving the password failed', async () => {
    KC.nativeLib.setGenericPassword = () => {
      throw new Error('scarry error')
    }

    const result = await KC.savePassword('test')
    expect(result).toBe(false)
  })

  it('should correctly retrieve password', async() => {
    KC.nativeLib.getGenericPassword = jest.fn().mockReturnValue({
      username: 'JolocomSmartWallet'
      password: 'test'
    })

    const result = await KC.getPassword()
    expect(result).toEqual({ found: true, password: 'test' })
  })

  it('should correctly return if password retrieval failed', async() => {
    KC.nativeLib.getGenericPassword = jest.fn().mockReturnValue(false)

    const result = await KC.getPassword()
    expect(result).toEqual({ found: false, password: '' })
  })

})
