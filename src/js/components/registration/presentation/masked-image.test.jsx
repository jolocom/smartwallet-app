import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import MaskedImage from './masked-image'

describe('(Component) MaskedImage', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow((<MaskedImage
        image={'path'}
        uncoveredPaths={{map: () => {}}}
        uncovering={false}
        onPointUncovered={() => {}}
        onUncoveringChange={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
