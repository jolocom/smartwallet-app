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
        checkPassword={() => {}}
        encryptDataWithPasswordOnRegister={() => {}}
        />),
        { context: { muiTheme: {} } }
    )
  })
  it('should update right field on entry', () => {
    const checkPassword = stub()
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
        checkPassword={checkPassword}
        encryptDataWithPasswordOnRegister={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('PasswordEntry').props().checkPassword({
      password: 'test',
      fieldName: 'pass'
    })
    // eslint-disable-next-line
    expect(checkPassword.called).to.be.true
    // eslint-enable-next-line
    expect(checkPassword.calls).to.deep.equal([{
      args: [{
        password: 'test',
        fieldName: 'pass'
      }]
    }])
  })
  it('should trigger function call encryptDataWithPasswordOnRegister', () => {
    const encryptDataWithPasswordOnRegister = stub()
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
        checkPassword={() => {}}
        encryptDataWithPasswordOnRegister={encryptDataWithPasswordOnRegister}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('PasswordEntry').props().encryptDataWithPasswordOnRegister({})
    // eslint-disable-next-line
    expect(encryptDataWithPasswordOnRegister.called).to.be.true
    // eslint-enable-next-line
  })
})
