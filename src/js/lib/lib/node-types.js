'use strict'

// import {PropTypes} from 'react'

let _types = {}

// const configTypes = {
//
//   predicate: PropTypes.object.isRequired,
//
//   /**
//    * Node color in the graph
//    */
//   nodeColor: PropTypes.string,
//
//   /**
//    * Node color in the graph
//    */
//   textColor: PropTypes.string,
//
//   /**
//    * Optional, icon used in the graph
//    */
//   icon: PropTypes.string,
//
//   /**
//    * Optional, value to render, can be a text value or image
//    */
//   titleField: PropTypes.string,
//
//   /**
//    *  Full screen react component
//    */
//   component: PropTypes.element,
//
//   /**
//    * Schema can be used to create the node creation form, validate values
//    * Available validators:
//    * https://git.io/vwxZj
//    */
//   schema: {
//     field: {
//       predicate: PropTypes.object.isRequired,
//       label: PropTypes.string,
//       validations: PropTypes.oneOfType([
//         PropTypes.string, PropTypes.arrayOf(PropTypes.string)
//       ])
//     }
//   },
//
//   access: PropTypes.arrayOf(PropTypes.oneOf(['public', 'private'])),
//
//   defaultAccess: PropTypes.oneOf(['public', 'private'])
// }

const configDefault = {
  defaultAccess: 'private'
}

export default {
  /**
   *
   */
  register(type, config) {
    if (_types[type] !== undefined) {
      throw new Error(`Node type ${type} as already been registered`)
    }

    if (typeof type === 'object' && 'uri' in type) {
      type = type.uri
    }
    // validate config
    _types[type] = Object.assign({}, configDefault, config)
    if (Object.keys(_types).length === 1) {
      _types['default'] = Object.assign({}, configDefault, config)
    }
  },
  /**
   *
   */
  get(type) {
    if (typeof type === 'string') {
      return _types[type]
    }

    for (let nodeType in _types) {
      if (nodeType === type.predicate) {
        return nodeType
      }
    }
  },

  /**
   *
   */
  componentFor(type) {
    if (type && typeof type === 'object' && 'uri' in type) {
      type = type.uri
    }

    let config
    if (type && (config = this.get(type))) {
      return config.component
    } else {
      return this.get('default').component
    }
  }
}
