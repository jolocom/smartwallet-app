import _ from 'lodash'
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
export function connect(params, wantedActions = []) {
  let wantedProps = params.props || params
  if (!wantedProps.map && typeof wantedProps !== 'function') {
    wantedProps = []
  }
  wantedActions = params.actions || wantedActions

  const mapStateToProps = (state, props) => {
    const getPropPair = (state, prop) => {
      if (_.isString(prop)) {
        prop = prop.split('.')
      }

      const pair = [prop.slice(-1)[0], state.getIn(prop)]

      if (typeof pair[1] === 'undefined') {
        throw new Error(
          'Trying to get non-existing state "' + prop +
          '" in Redux connect() wrapper')
      }

      if (pair[1] !== null && pair[1].toJS) {
        pair[1] = pair[1].toJS()
      }

      return pair
    }

    if (typeof wantedProps !== 'function') {
      return _.fromPairs(wantedProps.map(prop => {
        return getPropPair(state, prop)
      }))
    } else {
      return wantedProps(state, props)
    }
  }

  const mapDispatchToProps = (dispatch, props) => {
    const getModuleAndActionNameFromID = (id) => {
      const [moduleName, actionName] = id.split(':')
      const module = require('redux_state/modules/' + moduleName)
      return [module, actionName]
    }

    if (typeof wantedActions !== 'function') {
      return bindActionCreators(_.fromPairs(wantedActions.map(id => {
        const [module, actionName] = getModuleAndActionNameFromID(id)
        return [actionName, module[actionName]]
      })), dispatch)
    } else {
      return wantedActions(dispatch, props)
    }
  }

  const connector = (component) => {
    const connected = reduxConnect(
      mapStateToProps,
      mapDispatchToProps,
      (stateProps, dispatchProps, ownProps) =>
        Object.assign({}, ownProps, stateProps, dispatchProps),
      {
        withRef: true,
        pure: typeof params.pure !== 'undefined' ? params.pure : true
      }
    )(component)
    connected.mapStateToProps = mapStateToProps
    connected.mapDispatchToProps = mapDispatchToProps
    // connected.reconnect = (reconnector) => {
    //   return reconnector(mapStateToProps, mapDispatchToProps)
    // }
    return connected
  }
  return connector
}

export function actionsFrom(module, actions) {
  return _.map(actions, action => module + ':' + action)
}
