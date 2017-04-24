import React from 'react'
import { shallow } from 'enzyme'
import PlusMenu from './plus-menu'

describe('(Component) PlusMenu', function() {
  it('should render properly the first time', function() {
    shallow((<PlusMenu
      goToManagement={() => {}}

      />),
      { context: { muiTheme: { } } }
    )
  })
})
