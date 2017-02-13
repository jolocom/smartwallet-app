/* global describe: true, it: true */
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Dialog from './dialog'
import {stub} from '../../../../test/utils'

describe('(Component) Dialog', function() {
  it('should update it state to be visible if prop says so', function() {
    const show = stub()
    const hide = stub()

    const wrapper = shallow(
      (<Dialog.WrappedComponent
        id="test" visible fullscreen
        show={show} hide={hide}
        />),
    )

    expect(wrapper).to.have.lengthOf(1)
    expect(show.called).to.be.true
  })
  it('should update it state to be not visible if prop absent', function() {
    const show = stub()
    const hide = stub()

    const wrapper = shallow(
      (<Dialog.WrappedComponent
        id="test" fullscreen
        show={show} hide={hide}
        />),
    )

    expect(wrapper).to.have.lengthOf(1)
    expect(hide.called).to.be.true
  })
})
