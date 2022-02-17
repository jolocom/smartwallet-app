const partiallyAppliedAction = <T>(type: T) => {
  return <P>(payload?: P) => ({
    type,
    payload,
  })
}

export default partiallyAppliedAction
