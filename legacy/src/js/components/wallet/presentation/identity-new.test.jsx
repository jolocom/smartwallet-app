import React from 'react'
import { shallow } from 'enzyme'
import IdentityNew from './identity-new'

describe('(Component) IdentityNew', function() {
  it('should render properly the first time', function() {
    shallow(
      (<IdentityNew
        toggleQRScan={() => {}}
        saveAttribute={() => {}}
        toggleEditField={() => {}}
        enterField={() => {}}
        identityNew={{
          toggleEdit: {
            field: '',
            bool: false
          },
          scanningQr: {
            scanning: false,
            scannedValue: ''
          }
        }}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
