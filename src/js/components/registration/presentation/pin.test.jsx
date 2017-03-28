import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import Pin from './pin'

describe('(Component) Pin', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow((<Pin
      	value={''}
      	valid={true}
      	focused={false}
        confirm={false}
        onChangeRequest={() => {}}
        onFocusChange={() => {}}
        onSubmit={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
