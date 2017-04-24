import React from 'react'
import { shallow } from 'enzyme'
import Pin from './pin'

describe('(Component) Pin', function() {
  it('should render properly the first time', function() {
    shallow((<Pin
      value=""
      valid
      focused
      confirm
      onChangeRequest={() => {}}
      onFocusChange={() => {}}
      onSubmit={() => {}}
      onChange={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
