import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'
import PasswordEntry from './passwordEntry'

describe('(Component) Password entry encryption', () => {
  it('should render properly first time', () => {
    shallow(
      (<PasswordEntry.WrappedComponent {
        ...PasswordEntry.mapStateToProps(Immutable.fromJS({
          keystore: {
            security: {
              loading: false,
              pass: '',
              passReenter: '',
              errorMsg: '',
              status: ''
            }
          }
        }))
      }
        checkPassword={() => {}}
        encryptDataWithPassword={() => {}}
        />),
        { context: { muiTheme: {} } }
    )
  })
})
