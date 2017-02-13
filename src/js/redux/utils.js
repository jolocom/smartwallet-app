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
  if (!wantedProps.map) {
    wantedProps = []
  }
  wantedActions = params.actions || wantedActions

  return reduxConnect(
    (state, props) => {
      if (typeof wantedProps !== 'function') {
        return _.fromPairs(wantedProps.map(prop => {
          const pair = [prop.split('.').slice(-1), state.getIn(prop)]
          if (pair[1].toJS) {
            pair[1] = pair[1].toJS()
          }
        }))
      } else {
        return wantedProps(state, props)
      }
    },
    (dispatch, props) => {
      if (typeof wantedActions !== 'function') {
        return bindActionCreators(_.fromPairs(wantedActions.map(id => {
          const [moduleName, actionName] = id.split(':')
          const module = require('redux/modules/' + moduleName)
          return [actionName, [actionName, module[actionName]]]
        })), dispatch)
      } else {
        return wantedActions(dispatch, props)
      }
    }
  )
}
