const sjcl = require('sjcl')

export interface EntropyGeneratorInterface {
  addFromDelta: (d: number) => void;
  getProgress: () => number;
  generateRandomString: (wordCount: number) => string;
}

export class EntropyGenerator implements EntropyGenerator {
  private generator = new sjcl.prng(10)

  addFromDelta(d: number) : void {
    this.generator.addEntropy(d, 1, 'user')
  }

  getProgress() : number {
    return this.generator.getProgress()
  }

  generateRandomString(wordCount: number) : string {
    // returns an array of length wordCount filled with random 4 byte words.
    const intArray = new Int32Array(this.generator.randomWords(wordCount))
    intArray.forEach(el => console.log(el))
    const buf = Buffer.from(intArray.buffer)
    return buf.toString('hex')
  }
}
