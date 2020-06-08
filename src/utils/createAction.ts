import { RootActions } from '~/modules/rootReducer'

const createAction = (type: RootActions) => {
  const actionCreator = (payload?: any) => ({
    type,
    payload,
  })

  actionCreator.type = type

  return actionCreator
}

export default createAction
