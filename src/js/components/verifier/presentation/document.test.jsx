import React from 'react'
import { shallow } from 'enzyme'
import DocumentType from './document'

describe('(Component) DocumentType', function() {
  it('should render properly the first time', function() {
    shallow((<DocumentType
      type=""
      chooseDocument={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
