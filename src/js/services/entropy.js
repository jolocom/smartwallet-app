import sjcl from 'sjcl'

export default class EntropyService {
  constructor() {
    // eslint-disable-next-line
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
    return this.generator.randomWords(wordCount)
      .join('')
      .replace(/-/g, '') // removing hyphens from result
      .toString(16)
      .substring(0, 32)
  }
}
