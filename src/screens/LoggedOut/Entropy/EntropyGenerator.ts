import * as sjcl from 'sjcl'

export interface EntropyGeneratorInterface {
  addFromDelta: (d: number) => void
  getProgress: () => number
  generateRandomString: (wordCount: number) => string
}

export class EntropyGenerator implements EntropyGeneratorInterface {
  private generator = new sjcl.prng(10)

  addFromDelta(d: number): void {
    this.generator.addEntropy(d, 1, 'user')
  }

  getProgress(): number {
    return this.generator.getProgress()
  }

  /**
   * Once the generator is ready, it can be used to generate a random buffer
   * @param wordCount - Amount of random words to generate (1 word - 4 bytes)
   * @returns Hex string encoding wordCount * 4 bytes random bytes
   */

  generateRandomString(wordCount: number): string {
    const intArray = new Int32Array(this.generator.randomWords(wordCount))
    const buf = Buffer.from(intArray.buffer)
    return buf.toString('hex')
  }
}
