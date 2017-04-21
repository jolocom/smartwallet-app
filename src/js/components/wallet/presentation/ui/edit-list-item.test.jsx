import React from 'react'
import { shallow } from 'enzyme'
import EditListItem from './edit-list-item'

describe('(Component) EditListItem', function() {
  it('should render properly the first time', function() {
    shallow((<EditListItem
      id=""
      icon=""
      textLabel=""
      textName=""
      focused
      verified
      onFocusChange={() => {}}
      onChange={() => {}}
      onDelete={() => {}}
      enableDelete={false}

      />),
      { context: { muiTheme: { } } }
    )
  })
})
