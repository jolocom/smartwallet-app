import React from 'react'
import { shallow } from 'enzyme'
import AddNew from './add-new'

describe('(Component) AddNew', function() {
  it('should render properly the first time', function() {
    shallow((<AddNew
      value=""
      onClick={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
