import React from 'react'
import { shallow } from 'enzyme'
import Pin from './pin'

describe('(Login Component) Pin', function() {
  it('should render properly the first time', function() {
    shallow((<Pin
      value="Test"
      valid
      focused
      canSubmit
      onChange={() => {}}
      onReset={() => {}}
      onSubmit={() => {}}
      onFocusChange={() => {}}
      pin
      />),
      { context: { muiTheme: { } } }
    )
  })
})
