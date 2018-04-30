import { registrationActions } from 'src/actions'

describe('Registration action creators', () => {
  beforeEach(() => {
  })

  describe('createIdentity')
  it('should attempt to create an identity', () => {
    const mockEntropy = '0x12345'
    const asyncAction = registrationActions.createIdentity(mockEntropy)

  })

  it('should correctly handle errors', async () => { })
})
