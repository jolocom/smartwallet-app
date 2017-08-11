import React from 'react'
import { shallow } from 'enzyme'
import MissingInfoItem from './missing-info-item'
import {StyleRoot} from 'radium'

describe('(Component) MissingInfoItemPresentation', function() {
  it('should render properly the first time', function() {
    shallow((<StyleRoot>
      <MissingInfoItem
        textLabel=""
        textValue=""
        field=""
        goToMissingInfo={() => {}}
        icon={null} />
    </StyleRoot>),
      { context: { muiTheme: { } } }
    )
  })
})
