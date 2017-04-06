import React from 'react'
import { shallow } from 'enzyme'
import UserType from './user-type'

describe('(Component) UserType', function() {
  it('should render properly the first time', function() {
    shallow((<UserType
      value=""
      valid
      user={false}
      onSelect={() => {}}
      onWhySelect={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
