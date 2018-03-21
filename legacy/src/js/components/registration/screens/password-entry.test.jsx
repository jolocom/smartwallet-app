import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { stub } from '../../../../../test/utils'
import PasswordEntry from './password-entry'

describe('(Component) Password entry encryption on register', () => {
  it('should render properly first time', () => {
    shallow(
      (<PasswordEntry.WrappedComponent {
        ...PasswordEntry.mapStateToProps(Immutable.fromJS({
          registration: {
            encryption: {
              loading: false,
              pass: '',
              passReenter: '',
              errorMsg: '',
              status: ''
            }
          }
        }))
      }
        setPassword={() => {}}
        encryptDataWithPasswordOnRegister={() => {}}
        />),
        { context: { muiTheme: {} } }
    )
  })
  it('should update right field on entry', () => {
    const setPassword = stub()
    const wrapper = shallow(
      (<PasswordEntry.WrappedComponent {
        ...PasswordEntry.mapStateToProps(Immutable.fromJS({
          registration: {
            encryption: {
              loading: false,
              pass: '',
              passReenter: '',
              errorMsg: '',
              status: ''
            }
          }
        }))
      }
        setPassword={setPassword}
        encryptDataWithPasswordOnRegister={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('PasswordEntry').props().setPassword({
      password: 'test',
      fieldName: 'pass'
    })
    // eslint-disable-next-line
    expect(setPassword.called).to.be.true
    // eslint-enable-next-line
    expect(setPassword.calls).to.deep.equal([{
      args: [{
        password: 'test',
        fieldName: 'pass'
      }]
    }])
  })
})
