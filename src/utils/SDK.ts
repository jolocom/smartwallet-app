const createIdentity = (entropy: string) => {
  return new Promise((res, rej) => {
    setTimeout(res, 300)
    setTimeout(rej, 300)
  })
}

const SDK = {
  createIdentity,
}

export default SDK
