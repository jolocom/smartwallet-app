import React from 'react'
import { shallow } from 'enzyme'
import NotVerifiedItem from './sub-menu-icon'

describe('(Component) NotVerifiedItemUI', () => {
  it('should render properly the first time', () => {
    shallow((<NotVerifiedItem
      field=""
      textLabel=""
      textValue=""
      requestVerificationCode={() => {}}
      resendVerificationCode={() => {}}
      enterVerificationCode={() => {}}
      setFocusedPin={() => {}}
      changePinValue={() => {}}
      icon={null} />),
      { context: { muiTheme: { } } }
    )
  })
})
