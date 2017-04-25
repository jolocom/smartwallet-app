import React from 'react'
import { shallow } from 'enzyme'
import StaticListItem from './static-list-item'

describe('(Component) StaticListItem', function() {
  it('should render properly the first time', function() {
    shallow((<StaticListItem
      index={100}
      icon=""
      textLabel=""
      textValue=""
      secondaryTextValue=""
      verified
      onVerify={() => {}}

      />),
      { context: { muiTheme: { } } }
    )
  })
})
