import React from 'react'
import { shallow } from 'enzyme'
import WalletIdentity from './identity'

describe('(Component) Wallet Identity', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletIdentity
        changePinValue={() => {}}
        expandField={() => {}}
        enterVerificationCode={() => {}}
        goTo={() => {}}
        identity={{}}
        requestVerificationCode={() => {}}
        resendVerificationCode={() => {}}
        requestIdCardVerification={() => {}}
        setFocusedPin={() => {}}
        showUserInfo={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
