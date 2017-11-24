import map from 'lodash/map'
import snakeCase from 'lodash/snakeCase'
import isObject from 'lodash/isObject'
import every from 'lodash/every'
import has from 'lodash/has'
import pick from 'lodash/pick'
import fromPairs from 'lodash/fromPairs'

export function action(module, name, options) {
  const id = 'little-sister/' + module + '/' + snakeCase(name).toUpperCase()
  const creator = options.creator || ((...args) => {
    return creator.buildAction(...args)
  })

  creator.buildAction = (...args) => {
    let hasParamsObject = false
    if (isObject(args[0])) {
      const params = args[0]
      const paramsConform = every(
        options.expectedParams,
        key => has(params, key)
      )
      if (paramsConform) {
        hasParamsObject = true
      }
    }

    let params
    if (!hasParamsObject) {
      params = fromPairs(options.expectedParams.map((key, idx) => 
        [key, args[idx]]
      ))
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
  const id = 'little-sister/' + module + '/' + snakeCase(prefix).toUpperCase()
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

export function makeActions(module, defs) {
  const actions = fromPairs(map(defs, (def, name) => {
    const actionType = def.async 
      ? asyncAction
      : action
    return [name, actionType(module, name, def)]
  }))

  actions.actions = actions
  return actions
}

function _enchanceCreator(creator, id, options) {
  creator.getParams = (action) => {
    return pick(action, options.expectedParams)
  }

  creator.id = id
  creator.expectedParams = options.expectedParams
  return creator
}
