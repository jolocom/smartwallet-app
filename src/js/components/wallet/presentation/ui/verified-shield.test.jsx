import React from 'react'
import { shallow } from 'enzyme'
import VerifiedShield from './verified-shield'

describe('(Component) VerifiedShield', function() {
  it('should render properly the first time', function() {
    shallow((<div><VerifiedShield verified /> </div>),
      { context: { muiTheme: { } } }
    )
  })
})
