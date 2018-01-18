import fromPairs from 'lodash/fromPairs'
import isString from 'lodash/isString'
import { bindActionCreators } from 'redux'
import { connect as reduxConnect } from 'react-redux'

/**
 * Abstraction on top of connect() from react-redux.
 *
 * In order to reduce boilerplate connecting components to Redux
 * and to prevent tightly coupling them to Redux itself, this decorator
 * is a drop-in replacement that allows you to specify the data and actions
 * you want to access declaritively.
 *
 * Suppose you have a Redux module named widget, exposing its data on
 * the lop-level global state, and with an action named foo, you could use
 * this like:
 *
 * connect({props: ['widget'], actions: ['widget:foo']})(
 *  props => <div onClick={props.foo}>
 *   {props.foo.data}
 *  </div>
 * )
 */
const helpers = {
  getModuleAndActionNameFromID: (id) => {
    const [moduleName, actionName] = id.split(':')

    // This can be avoided if we improve the export structure
    const reducer = require('redux_state/modules/' + moduleName).default
    const { actions } = require('redux_state/modules/' + moduleName)

    const module = {...actions, 'default': reducer}

    return [module, actionName]
  },

  getPropPair: (state, prop) => {
    if (isString(prop)) {
      prop = prop.split('.')
    }

    const key = prop.slice(-1)[0]
    let value = state.getIn(prop)

    if (typeof value === 'undefined') {
      const errMsg = `Trying to use non-existing state ${prop}, in wrapper`
      throw new Error(errMsg)
    }

    if (value !== null && value.toJS) {
      value = value.toJS()
    }

    return [key, value]
  }
}

export function connect(params) {
  const wantedProps = params.props || []
  const wantedActions = params.actions || []

  const mapStateToProps = (state) =>
    fromPairs(wantedProps.map(prop =>
      helpers.getPropPair(state, prop)
    ))

  const namesMappedToFunctions = fromPairs(wantedActions.map(id => {
    const [module, actionName] = helpers.getModuleAndActionNameFromID(id)
    return [actionName, module[actionName]]
  }))

  const mapDispatchToProps = (dispatch, props) =>
    bindActionCreators(namesMappedToFunctions, dispatch)

  return (component) => {
    const mergeProps = (stateProps, dispatchProps, ownProps) => {
      const extra = {
        withRef: true,
        pure: typeof params.pure !== 'undefined' ? params.pure : true
      }
      return Object.assign({}, ownProps, stateProps, dispatchProps, extra)
    }

    const connected = reduxConnect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps
    )(component)

    connected.mapStateToProps = mapStateToProps
    connected.mapDispatchToProps = mapDispatchToProps

    return connected
  }
}
