import React from 'react'
import { shallow } from 'enzyme'
import EditListItem from './edit-list-item'

describe('(Component) EditListItem', function() {
  it('should render properly the first time', function() {
    shallow((<EditListItem
      id=""
      icon=""
      label=""
      name=""
      focused
      verified
      onFocusChange={() => {}}
      onChange={() => {}}
      onDelete={() => {}}
      categories={[]}
      enableDelete={false}

      />),
      { context: { muiTheme: { } } }
    )
  })
})
