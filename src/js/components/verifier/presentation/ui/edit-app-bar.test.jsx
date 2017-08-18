import React from 'react'
import { shallow } from 'enzyme'
import EditAppBar from './edit-app-bar'

describe('(Component) EditAppBar', function() {
  it('should render properly the first time', function() {
    shallow((<EditAppBar
      title=""
      onSave={() => {}}
      onClose={() => {}}

      />),
      { context: { muiTheme: { } } }
    )
  })
})
