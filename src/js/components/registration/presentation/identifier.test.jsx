import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import Identifier from './identifier'

describe('(Component) Identifier', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow((<Identifier
        value={''}
        valid={false}
        username={'xyz'}
        onSubmit={() => {}}
        onChange={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
