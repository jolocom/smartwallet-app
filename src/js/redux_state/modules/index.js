import map from 'lodash/map'
import snakeCase from 'lodash/snakeCase'
import isObject from 'lodash/isObject'
import every from 'lodash/every'
import has from 'lodash/has'
import pick from 'lodash/pick'
import fromPairs from 'lodash/fromPairs'

/* @summary - creates a sync action creator
 *
 * @param {String} moduleName - used to generate the unique action identifier
 * @param {String} actionName - used to generate the unique action identifier
 * @param {Object} actionDefinition - a configuration object defining the
 * expected action parameters, and a custom action creator
 *
 * @returns {Object} actions - TODO
 * 
 * @example syncAction('exampleModule', 'exampleActionName', {
     expectedParams: ['first', 'second'],
     creator: (params) => {
       return (dispatch, getState) => {
         ...
       }
     }
   }
 */

export function syncAction(moduleName, actionName, definition) {
  const id = `${moduleName}/${snakeCase(actionName).toUpperCase()}`

  // Called when .buildAction is called on a function
  // If no action creator is passed
  const actionBuilder = (actionParams) => {
    return { type: id, actionParams }
 }

  const creator = definition.creator || actionBuilder 
  creator.buildAction = actionBuilder

  return _enchanceCreator(creator, id, definition)
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

/* @summary - Mass prepares actions by delegating to appropriate creators based 
 * on the action nature (async / sync)
 *
 * @param {String} moduleName - used to generate the unique action identifier
 *
 * @param {Object} actionDefinitions - a configuration object defining the
 * expected action parameters, whether it's async or not, and a custom action
 * creator
 *
 * @returns {Object} actions -  action names as keys, the action creator as a value, 
 * and a circular reference to itself
 * 
 * @example makeActions('exampleModule', {
    exampleAction: {
      expectedParams: ['first', 'second'],
      async: false,
      creator: (params) => {
        return (dispatch, getState) => {
          ...
        }
      }
    }
  }
 */

export function makeActions(moduleName, actionDefinitions) {
  const actions = {}

  map(actionDefinitions, (definition, actionName) => {
    const functionHandler = definition.async
      ? asyncAction
      : syncAction

    actions[actionName] = functionHandler(moduleName, actionName, definition)
  })

  // TODO Refactor
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
