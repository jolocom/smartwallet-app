import _ from 'lodash'

export function action(module, name, options) {
  const id = 'little-sister/' + module + '/' + _.snakeCase(name).toUpperCase()
  const creator = options.creator || ((...args) => {
    return creator.buildAction(...args)
  })

  creator.buildAction = (...args) => {
    let hasParamsObject = false
    if (_.isObject(args[0])) {
      const params = args[0]
      const paramsConform = _.every(
        options.expectedParams,
        key => _.has(params, key)
      )
      if (paramsConform) {
        hasParamsObject = true
      }
    }

    let params
    if (!hasParamsObject) {
      params = _(options.expectedParams)
                .map((key, idx) => [key, args[idx]])
                .fromPairs()
                .valueOf()
    } else {
      params = args[0]
    }

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
