import { EntropyGenerator } from 'src/lib/entropyGenerator'

describe('EntropyGenerator lib', () => {
  let Entropy

  beforeEach(() => {
    Entropy = new EntropyGenerator()
  })

  it('should correctly add deltas to generator', () => {
    const mockAddEntropy = jest.fn()
    Entropy.generator.addEntropy = mockAddEntropy
    Entropy.addFromDelta(1)

    expect(mockAddEntropy).toBeCalledWith(1, 1, 'user')
  })

  it('should correctly generate a randomString given a word count', () => {
    const mockRandomWords = jest.fn()
    mockRandomWords.mockReturnValue([2146374127, 2105273088, 2131944135, -450876854])
    Entropy.generator.randomWords = mockRandomWords
    Entropy.generateRandomString(4)

    expect(mockRandomWords).toBeCalledWith(4)
    expect(Entropy.generateRandomString(4)).toBe('ef11ef7f00eb7b7dc7e2127f4a2a20e5')
  })
})