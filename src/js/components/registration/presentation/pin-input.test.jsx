import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import PinInput from './pin-input'

describe('(Component) PinInput', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow((<PinInput
      	value={''}
      	disabled={true}
      	focused={false}
        confirm={false}
        onChange={() => {}}
        onFocusChange={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
