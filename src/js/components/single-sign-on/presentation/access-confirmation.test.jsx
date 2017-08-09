import React from 'react'
import {shallow} from 'enzyme'
import AccessConfirmation from './access-confirmation'

describe('(Component) AccessConfirmationPresentation', () => {
  it('should render properly the first time', () => {
    shallow((<AccessConfirmation
      entity={{}}
    />),
    { context: { muiTheme: { } } }
  )
  })
})
