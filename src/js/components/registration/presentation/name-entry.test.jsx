import React from 'react'
import { shallow } from 'enzyme'
import NameEntry from './name-entry'

describe('(Component) NameEntry', function() {
  it('should render properly the first time', function() {
    shallow((<NameEntry
      value={''}
      valid={false}
      errorMsg={''}
      onSubmit={() => {}}
      onChange={() => {}}
      onCheck={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
