import { EntropyGenerator } from '~/screens/LoggedOut/Onboarding/Registration/Entropy/EntropyGenerator'

describe('EntropyGenerator', () => {
  let Entropy: EntropyGenerator

  beforeEach(() => {
    Entropy = new EntropyGenerator()
  })

  it('should correctly add deltas to generator', () => {
    const mockAddEntropy = jest
      // @ts-ignore private
      .spyOn(Entropy.generator, 'addEntropy')
      .mockImplementation()
    Entropy.addFromDelta(1)

    expect(mockAddEntropy).toBeCalledWith(1, 1, 'user')
  })

  it('should correctly get progress', () => {
    const mockGetProgress = jest
      // @ts-ignore private
      .spyOn(Entropy.generator, 'getProgress')
      .mockReturnValue(0)

    expect(Entropy.getProgress()).toBe(0)
    expect(mockGetProgress).toHaveBeenCalledTimes(1)
  })

  it('should correctly generate a randomString given a word count', () => {
    const expectedEntropy = 'ef11ef7f00eb7b7dc7e2127f4a2a20e5'
    const mockRandomWords = jest
      // @ts-ignore private
      .spyOn(Entropy.generator, 'randomWords')
      .mockReturnValue([2146374127, 2105273088, 2131944135, -450876854])

    expect(Entropy.generateRandomString(4)).toBe(expectedEntropy)
    expect(mockRandomWords).toBeCalledWith(4)
  })
})
