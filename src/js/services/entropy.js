import sjcl from 'sjcl'
import bitcore from 'bitcore-lib'

export default class EntropyService {
  constructor() {
    this.generator = new sjcl.prng(7) // eslint-disable-line new-cap
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

  getHashedEntropy(randomString) {
    let Random = bitcore.crypto.Random
    var entBuf = Buffer.from(randomString)
    var randBuf = Random.getRandomBuffer(256 / 8)
    var hashedEnt = this.concatAndSha256(randBuf, entBuf).slice(0, 128 / 8)
    return hashedEnt
  }

  concatAndSha256(entropyBuf0, entropyBuf1) {
    let Hash = bitcore.crypto.Hash
    var totalEnt = Buffer.concat([entropyBuf0, entropyBuf1])
    if (totalEnt.length !== entropyBuf0.length + entropyBuf1.length) {
      throw new Error('generateRandomSeed: Logic error! Concatenation of entropy sources failed.')
    }
    var hashedEnt = Hash.sha256(totalEnt)
    return hashedEnt
  }
}
