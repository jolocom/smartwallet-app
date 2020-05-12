const createIdentity = (entropy: string) => {
  return new Promise((res, rej) => {
    setTimeout(res, 3000)
    setTimeout(rej, 3000)
  })
}

const SDK = {
  createIdentity,
}

export default SDK
