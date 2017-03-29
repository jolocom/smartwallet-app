import React from 'react'
import { shallow } from 'enzyme'
import PinInput from './pin-input'

describe('(Component) PinInput', function() {
  it('should render properly the first time', function() {
    shallow((<PinInput
      value=""
      focused
      confirm
      onChange={() => {}}
      onFocusChange={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
