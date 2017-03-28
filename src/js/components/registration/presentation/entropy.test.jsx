import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import Entropy from './entropy'

describe('(Component) Entropy', function() {
  it('should render properly the first time', function() {
    const onSubmit = () => {}
    const onChange = () => {}
    const wrapper = shallow((<Entropy
        imageUncovering={false}
        imageUncoveredPaths={'path'}
        user={''}
        onImagePointUncoverd={() => {}}
        onImageUncoveringChange={() => {}}
        onMouseMovement={() => {}}
        onSubmit={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
