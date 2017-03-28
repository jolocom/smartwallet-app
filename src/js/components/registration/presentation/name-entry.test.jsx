import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import NameEntry from './name-entry'

describe('(Component) NameEntry', function() {
  it('should render properly the first time', function() {
    const onSubmit = () => {}
    const onChange = () => {}
    const onCheck = () => {}
    const wrapper = shallow((<NameEntry
        value={''}
        valid={false}
        errorMsg={''}
        onSubmit={onSubmit}
        onChange={onChange}
        onCheck={onCheck}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
