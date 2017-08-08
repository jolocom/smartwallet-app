import React from 'react'
import {shallow} from 'enzyme'
import AccessRequest from './access-confirmation'

describe('(Component) AccessRequestPresentation', () => {
  it('should render properly the first time', () => {
    shallow((<AccessRequest
      identity={{}}
      entity={{}}
      accessInfo={() => {}}
      grantAccessToRequester={() => {}}
      requestedFields={[]} />),
    { context: { muiTheme: { } } }
  )
  })
})
