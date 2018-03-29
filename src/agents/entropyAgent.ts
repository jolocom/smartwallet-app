// const sjcl = require('node_modules/sjcl')
export class EntropyAgent {

  public generator: any

  constructor() {
    this.generator = new sjcl.prng(7)
  }

  addFromDelta(d: number) {
    this.generator.addEntropy(d, 1, 'user')
  }

  getProgress() {
    return this.generator.getProgress()
  }

  isReady() {
    return this.generator.isReady()
  }

  getRandomString(wordCount: number) {
    // returns an array of length wordCount filled with random 4 byte words.
    const intArray = new Int32Array(this.generator.randomWords(wordCount))
    const buf = Buffer.from(intArray.buffer)
    return buf.toString('hex')
  }
}