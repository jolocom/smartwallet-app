import _ from 'lodash'

export function action(module, name, options) {
  const id = 'little-sister/' + module + name
  const creator = (params) => {
    return {
      'type': 'little-sister/' + module + name,
      ...params
    }
  }
  creator.getParams = (action) => {
    return _.pick(action, options.expectedParams)
  }

  creator.id = id
  creator.expectedParams = options.expectedParams
  return creator
}
