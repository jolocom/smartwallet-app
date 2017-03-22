import sjcl from 'sjcl'

export default class EntropyService {
  constructor() {
    this.generator = new sjcl.prng(5) // es-lint-disable new-cap
    // this.generator.startCollectors()
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

  getRandomNumbers(count) {
    return this.generator.randomWords(count).map(s => parseInt(s))
  }

  getRandomString(wordCount) {
    return this.generator.randomWords(wordCount).join('')
  }
}
