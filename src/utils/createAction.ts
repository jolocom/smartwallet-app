import { RootActions } from '~/modules/rootReducer'

const createAction = <T = any>(type: RootActions) => {
  const actionCreator = (payload?: T) => ({
    type,
    payload,
  })

  actionCreator.type = type

  return actionCreator
}

export default createAction
