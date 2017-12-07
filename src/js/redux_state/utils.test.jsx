/* global describe: true, it: true */
import React from 'react'
import * as Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import { connect } from './utils'

const mockStore = configureStore([])

describe('Redux abstraction', function() {
  it('should properly map state based on strings', function() {
    const fakeComponent = (props) => <div></div>
    const Connected = connect({
      props: ['test.foo']
    })(fakeComponent)

    const expectedProps = { foo: 5 }
    const fakeState = Immutable.fromJS({
      irrelevant: ['irrelevant', 'state'],
      test: { foo: 5 }
    })

    expect(Connected.mapStateToProps(fakeState)).to.deep.equal(expectedProps)
  })

  it('should properly map actions based on strings', function() {
    const fakeComponent = (props) => <div></div>
    const Connected = connect({
      actions: ['common/dialog:openDialog']
    })(fakeComponent)

    const store = mockStore({})
    const openDialog = shallow(<Connected store={store} />).prop('openDialog')
    expect(openDialog).to.equal(
      require('redux_state/modules/common/dialog').openDialog
    )
  })
})
