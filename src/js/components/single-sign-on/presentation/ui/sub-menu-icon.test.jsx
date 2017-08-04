import React from 'react'
import { shallow } from 'enzyme'
import SubMenuIcon from './sub-menu-icon'

describe('(Component) SubMenuIcon', () => {
  it('should render properly the first time', () => {
    shallow((<SubMenuIcon
      name=""
      style={{}}
      onClick={() => {}}
      icon={null} />),
      { context: { muiTheme: { } } }
    )
  })
})
