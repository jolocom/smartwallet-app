import React from 'react'
import { shallow } from 'enzyme'
import EmailConfirmation from './email-confirmation'

describe('(Component) EmailConfirmation', function () {
  it('should initialize properly', function() {
    shallow((<EmailConfirmation
      confirmation
      loading
      goToAfterConfirmEmail={() => {}}
    />), { context: { muiTheme: { } } }
    )
  })
})
