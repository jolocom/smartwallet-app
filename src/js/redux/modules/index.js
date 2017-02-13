import _ from 'lodash'

export function action(module, name, options) {
  const id = 'little-sister/' + module + '/' + name.toUpperCase()
  const creator = (params) => {
    return {
      type: id,
      ...params
    }
  }

  return _enchanceCreator(creator, id, options)
}

export function asyncAction(module, prefix, options) {
  const id = 'little-sister/' + module + '/' + name.toUpperCase()
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

  creator.id = id
  creator.expectedParams = options.expectedParams
  return creator
}
