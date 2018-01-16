import sjcl from 'sjcl'

export default class EntropyService {
  constructor() {
    // eslint-disable-next-line new-cap
    this.generator = new sjcl.prng(7)
  }

  addFromDelta(d) {
    this.generator.addEntropy(d, 1, 'mouse')
  }

  getProgress() {
    return this.generator.getProgress()
  }

  isReady() {
    return this.generator.isReady()
  }

  getRandomString(wordCount) {
    // returns an array of length wordCount filled with random 4 byte words.
    const intArray = new Int32Array(this.generator.randomWords(wordCount))
    const buf = new Buffer(intArray.buffer)
    return buf.toString('hex')
  }
}

