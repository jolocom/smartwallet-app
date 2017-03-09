/* global describe: true, it: true */
import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Dialog from './dialog'
import {stub} from '../../../../test/utils'

describe('(Component) Dialog', function() {
  it('should update its state to be visible if prop says so', function() {
    const show = stub()
    const hide = stub()

    const wrapper = shallow(
      (<Dialog.WrappedComponent id="test" visible
        {...Dialog.mapStateToProps(Immutable.fromJS({dialog: {
          test: {visible: true}
        }}), {id: 'test'})}
        show={show} hide={hide}
        />)
    )
    wrapper.instance().componentDidMount()

    expect(wrapper).to.have.lengthOf(1)
    expect(wrapper.prop('style')['opacity']).to.equal(1)
    expect(show.called).to.be.true
  })
  it('should update its state to be not visible if prop absent', function() {
    const show = stub()
    const hide = stub()

    const wrapper = shallow(
      (<Dialog.WrappedComponent id="test"
        {...Dialog.mapStateToProps(Immutable.fromJS({dialog: {
          test: {visible: false}
        }}), {id: 'test'})}
        show={show} hide={hide}
        />)
    )
    wrapper.instance().componentDidMount()

    expect(wrapper).to.have.lengthOf(1)
    expect(wrapper.prop('style')['opacity']).to.not.equal(1)
    expect(hide.called).to.be.true
  })
})
