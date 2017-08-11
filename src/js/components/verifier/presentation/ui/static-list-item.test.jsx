import React from 'react'
import { shallow } from 'enzyme'
import StaticListItem from './static-list-item'
import {StyleRoot} from 'radium'

describe('(Component) StaticListItem', function() {
  it('should render properly the first time', function() {
    shallow((<StyleRoot>
      <StaticListItem
        index={100}
        icon=""
        textLabel=""
        textValue=""
        secondaryTextValue=""
        verified
        onVerify={() => {}}

      />
    </StyleRoot>),
      { context: { muiTheme: { } } }
    )
  })
})
