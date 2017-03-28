import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import UserType from './user-type'

describe('(Component) UserType', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow((<UserType
      	value={''}
      	valid={true}
        user={false}
        onSelect={() => {}}
        onWhySelect={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
