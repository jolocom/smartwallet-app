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
    const random = bitcore.crypto.Random
    const entBuff = Buffer.from(randomString)
    const randBuff = random.getRandomBuffer(256 / 8)
    return this.concatAndSha256(randBuff, entBuff).slice(0, 128 / 8)
  }

  concatAndSha256(entropyBuf0, entropyBuf1) {
    const hash = bitcore.crypto.Hash
    const totalEnt = Buffer.concat([entropyBuf0, entropyBuf1])
    if (totalEnt.length !== entropyBuf0.length + entropyBuf1.length) {
      throw new Error('Concatenation of entropy sources failed.')
    }
    return hash.sha256(totalEnt)
  }
}
