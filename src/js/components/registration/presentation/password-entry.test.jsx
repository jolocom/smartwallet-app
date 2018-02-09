import React from 'react'
import { shallow } from 'enzyme'
import PasswordEntry from './password-entry'

describe('(Presentation) Password entry encryption on register', function() {
  it('should render properly the first time', function() {
    shallow((<PasswordEntry
      security={{pass: '', passReenter: ''}}
      progress={{loading: false, loadingMsg: ''}}
      checkPassword={() => {}}
      encryptDataWithPasswordOnRegister={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
