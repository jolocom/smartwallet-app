type Action = {
  type: unknown
  payload: unknown
}

const createAction = <A extends Action>(type: A['type']) => {
  const actionCreator = (payload: A['payload']) => ({
    type,
    payload,
  })
  // TODO: check if type prop is being used anywhere
  actionCreator.type = type

  return actionCreator
}

export default createAction
