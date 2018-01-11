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
 * @returns {Object} creator - a sync action creator with an associated ID and
 * actionBuilder
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

  const actionBuilder = (actionParams) => {
    return { type: id, ...actionParams }
  }

  const creator = definition.creator || actionBuilder 
  creator.buildAction = actionBuilder

  creator.id = id
  return creator
}

/* @summary - creates an async action creator
 *
 * @param {String} moduleName - used to generate the unique action identifier
 * @param {String} actionName - used to generate the unique action identifier
 * @param {Object} actionDefinition - a configuration object defining the
 * expected action parameters, and a custom action creator
 * @param {Object} callback - 
 *
 * @returns {Object} creator - an async action creator with an associated ID and
 * actionBuilder
 * 
 * @example asyncAction('exampleModule', 'exampleActionName', {
     expectedParams: ['first', 'second'],
     creator: (params, async () => {...}) => {
       return (dispatch, getState) => {
         ...
       }
     }
   }
 */
export function asyncAction(moduleName, actionName, definition) {
  const id = `${moduleName}/${snakeCase(actionName).toUpperCase()}`

  const actionBuilder = (actionParams, promise) => {
    return {
      types: [id, creator.id_success, creator.id_fail],
      promise,
      ...actionParams
    }
  }

  const creator = definition.creator || ((actionParams) => { 
    return actionBuilder(actionParams, definition.promise)
  })

  creator.id_success = id + '_SUCCESS'
  creator.id_fail = id + '_FAIL'
  creator.buildAction = actionBuilder
  creator.id = id

  return creator
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
