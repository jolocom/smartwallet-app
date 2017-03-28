import React from 'react'
import { shallow } from 'enzyme'
import MaskedImage from './masked-image'

describe('(Component) MaskedImage', function() {
  it('should render properly the first time', function() {
    shallow((<MaskedImage
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
