export const setDid = (did: string) => {
  return {
    type: 'DID_SET',
    value: did
  }
}