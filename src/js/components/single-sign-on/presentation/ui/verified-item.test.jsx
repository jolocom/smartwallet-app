import React from 'react'
import { shallow } from 'enzyme'
import VerifiedItem from './verified-item'
import {StyleRoot} from 'radium'

describe('(Component) VerifiedItemPresentation', function() {
  it('should render properly the first time', function() {
    shallow((<StyleRoot>
      <VerifiedItem
        textLabel=""
        textValue=""
        verified=""
        icon={null} />
    </StyleRoot>),
      { context: { muiTheme: { } } }
    )
  })
})
