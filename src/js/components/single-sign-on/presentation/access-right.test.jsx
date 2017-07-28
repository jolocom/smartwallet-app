import React from 'react'
import { shallow } from 'enzyme'
import SingleSignOnAccessRight from './access-right'

describe('(Component) SingleSignOnAccessRightPresentation', () => {
  it('should render properly the first time', () => {
    shallow((<SingleSignOnAccessRight
      services={[]}
      showSharedData={() => {}}
      showDeleteServiceWindow={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
