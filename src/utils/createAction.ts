const createAction = <T, P>(type: T) => {
  const actionCreator = (payload: P) => ({
    type,
    payload,
  })

  actionCreator.type = type

  return actionCreator
}

export default createAction
