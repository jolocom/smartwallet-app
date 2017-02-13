import _ from 'lodash'

export function action(module, name, options) {
  const id = 'little-sister/' + module + '/' + _.snakeCase(name).toUpperCase()
  const creator = options.creator || ((params) => {
    return creator.buildAction(params)
  })

  return _enchanceCreator(creator, id, options)
}

export function asyncAction(module, prefix, options) {
  const id = 'little-sister/' + module + '/' + _.snakeCase(name).toUpperCase()
  const creator = (params) => {
    return {
      types: [id, id + '_SUCCESS', id + '_FAIL'],
      promise: options.promise,
      ...params
    }
  }

  return _enchanceCreator(creator, id, options)
}

function _enchanceCreator(creator, id, options) {
  creator.getParams = (action) => {
    return _.pick(action, options.expectedParams)
  }
  creator.buildAction = (params) => {
    return {
      type: id,
      ...params
    }
  }

  creator.id = id
  creator.expectedParams = options.expectedParams
  return creator
}
