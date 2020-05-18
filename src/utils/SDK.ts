const recoverIdentity = <T>(mnemonicSeedPhrase: T) => {
  return new Promise((res, rej) => {
    setTimeout(res, 3000)
    // setTimeout(rej, 3000)
  })
}

const createIdentity = (entropy: string) => {
  return new Promise((res, rej) => {
    setTimeout(res, 3000)
    // setTimeout(rej, 3000)
  })
}

const getMnemonic = () => [
  'afraid',
  'age',
  'fuel',
  'impulse',
  'undo',
  'cable',
  'inner',
  'sail',
  'bacon',
  'aisle',
  'wish',
  'acquire',
]

const SDK = {
  recoverIdentity,
  createIdentity,
  getMnemonic,
}

export default SDK
