import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'
import PasswordEntry from './passwordEntry'

describe('(Component) Password entry keystorage', () => {
  it('should render properly first time', () => {
    shallow(
      (<PasswordEntry.WrappedComponent {
        ...PasswordEntry.mapStateToProps(Immutable.fromJS({
          keystore: {
            keyStorage: {
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
