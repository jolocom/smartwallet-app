import React from 'react'
import { shallow } from 'enzyme'
import Identifier from './identifier'

describe('(Component) Identifier', function() {
  it('should render properly the first time', function() {
    shallow((<Identifier
      value={''}
      valid={false}
      username={'xyz'}
      onSubmit={() => {}}
      onChange={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
