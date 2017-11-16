export default function backendMiddleware(backend, services) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState, {backend, services})
      }

      const { promise, types, ...rest } = action
      if (!promise) {
        return next(action)
      }

      const [REQUEST, SUCCESS, FAILURE] = types
      next({...rest, type: REQUEST})

      const actionPromise = promise(backend)
      actionPromise.then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => next({...rest, error, type: FAILURE})
      ).catch(error => {
        console.error('MIDDLEWARE ERROR:', error,
                      ...(error.stack ? [error.stack] : []))
        next({...rest, error, type: FAILURE})
      })

      return actionPromise
    }
  }
}
