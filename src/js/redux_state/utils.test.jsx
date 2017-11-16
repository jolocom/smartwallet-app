/* global describe: true, it: true */
import React from 'react'
import * as Immutable from 'immutable'
import { expect } from 'chai'
import { render, shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
// import { stub } from '../../../../test/utils'
import { connect } from './utils'

const middlewares = []
const mockStore = configureStore(middlewares)

describe('Redux abstraction', function() {
  it('should be usable as a drop-in connect() replacement', function() {
    const Connected = connect(
      (state, props) => ({foo: state.foo, bar: state.bar}),
      (dispatch, props) => ({func: () => dispatch({type: 'test'})})
    )((props) => (
      <div data-test={props.foo} onClick={props.func}>
        {props.bar}
      </div>
    ))

    const store = mockStore({
      foo: 'spam',
      bar: 'eggs'
    })
    expect(render(<Connected store={store} />).html())
          .to.equal('<div data-test="spam">eggs</div>')

    shallow(<Connected store={store} />).prop('func')()
    expect(store.getActions()).to.deep.equal([{type: 'test'}])
  })

  it('should properly map state based on strings', function() {
    const Connected = connect({
      props: ['test.foo']
    })((props) => (<div></div>))

    expect(Connected.mapStateToProps(Immutable.fromJS({test: {foo: 5}})))
          .to.deep.equal({foo: 5})
  })

  it('should properly map actions based on strings', function() {
    const Connected = connect({
      actions: ['common/dialog:openDialog']
    })((props) => (<div></div>))

    const store = mockStore({})
    const openDialog = shallow(<Connected store={store} />).prop('openDialog')
    expect(openDialog).to.equal(
      require('redux_state/modules/common/dialog').openDialog
    )
  })
})
