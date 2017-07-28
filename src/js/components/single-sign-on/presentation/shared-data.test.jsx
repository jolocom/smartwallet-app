import React from 'react'
import { shallow } from 'enzyme'
import SharedDatePresentation from './shared-data'

describe('(Component) SingleSignOnSharedDatePresentation', () => {
  it('should render properly the first time', () => {
    shallow((<SharedDatePresentation
      serviceUrl=""
      sharedData={[]}
      serviceName=""
      deleteService={() => {}}
      goToAccessRightScreen={() => {}}
      showDeleteServiceWindow={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
