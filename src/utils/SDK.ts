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

const SDK = {
  recoverIdentity,
  createIdentity,
}

export default SDK
