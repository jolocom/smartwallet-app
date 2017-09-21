import React from 'react'
import { shallow } from 'enzyme'
import Passphrase from './phrase'

describe('(Login Component) Passphrase', function() {
  it('should render properly the first time', function() {
    shallow((<Passphrase
      value="Test"
      canSubmit
      onChange={() => {}}
      onSubmit={() => {}}
      passphrase={{valueOwnURL: ''}}
      toggleHasOwnURL={() => {}}
      setValueOwnURL={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
