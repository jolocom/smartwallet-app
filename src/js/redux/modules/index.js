import _ from 'lodash'

export function action(module, name, options) {
  const id = 'little-sister/' + module + '/' + _.snakeCase(name).toUpperCase()
  const creator = options.creator || ((params) => {
    return creator.buildAction(params)
  })
  creator.buildAction = (params) => {
    return {
      type: id,
      ...params
    }
  }

  return _enchanceCreator(creator, id, options)
}

export function asyncAction(module, prefix, options) {
  const id = 'little-sister/' + module + '/' + _.snakeCase(prefix).toUpperCase()
  const creator = options.creator || ((params) => {
    return creator.buildAction(params, options.promise)
  })
  creator.id_success = id + '_SUCCESS'
  creator.id_fail = id + '_FAIL'

  creator.buildAction = (params, promise) => {
    return {
      types: [id, creator.id_success, creator.id_fail],
      promise: promise,
      ...params
    }
  }

  return _enchanceCreator(creator, id, options)
}

function _enchanceCreator(creator, id, options) {
  creator.getParams = (action) => {
    return _.pick(action, options.expectedParams)
  }

  creator.id = id
  creator.expectedParams = options.expectedParams
  return creator
}
