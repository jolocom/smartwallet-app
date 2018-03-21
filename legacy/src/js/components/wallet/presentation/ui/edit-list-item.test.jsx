import React from 'react'
import { shallow } from 'enzyme'
import EditListItem from './edit-list-item'
import {StyleRoot} from 'radium'

describe('(Component) EditListItem', function() {
  it('should render properly the first time', function() {
    shallow((<StyleRoot>
      <EditListItem
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

      />
    </StyleRoot>),
      { context: { muiTheme: { } } }
    )
  })
})
