import React from 'react'
import { shallow } from 'enzyme'
import AccountDetailsEthereum from './account-details-ethereum'

describe('(Component) AccountDetailsEthereum', function() {
  it('should render properly the first time', function() {
    shallow((<AccountDetailsEthereum
      mainAddress=""
      onClose={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
