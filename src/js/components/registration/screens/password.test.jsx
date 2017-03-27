/* global describe: true, it: true */
import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationPasswordScreen from './password'

describe.only('(Component) RegistrationPasswordScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationPasswordScreen.WrappedComponent {
        ...RegistrationPasswordScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            password: {
              value: '',
              repeated: '',
              strength: 'weak',
              hasLowerCase: false,
              hasUpperCase: false,
              hasDigit: false,
              valid: false
            }
          }
        }))
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Password').prop('value')).to.be.empty
    expect(wrapper.find('Password').prop('repeated')).to.be.empty
    expect(wrapper.find('Password').prop('strength')).to.equal('weak')
    expect(wrapper.find('Password').prop('hasLowerCase')).to.be.false
    expect(wrapper.find('Password').prop('hasUpperCase')).to.be.false
    expect(wrapper.find('Password').prop('hasDigit')).to.be.false
    expect(wrapper.find('Password').prop('valid')).to.be.false
  })
  it('should call the right function for every event', function() {
    const changePassword = stub()
    const changeRepeatedPassword = stub()
    const goForward = stub()
    const wrapper = shallow(
      (<RegistrationPasswordScreen.WrappedComponent {
        ...RegistrationPasswordScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            password: {
              value: '',
              repeated: '',
              strength: 'weak',
              hasLowerCase: false,
              hasUpperCase: false,
              hasDigit: false,
              valid: false
            }
          }
        }))
      }
        setPassword={changePassword}
        setRepeatedPassword={changeRepeatedPassword}
        goForward={goForward}
     />),
      { context: { muiTheme: { } } }
    )
    wrapper.find('Password').prop('onChangePassword')('Test1')
    wrapper.find('Password').prop('onChangeRepeatedPassword')('Test2')
    wrapper.find('Password').prop('onSubmit')()

    expect(changePassword.called).to.be.true
    expect(changePassword.calls).to.deep.equal([{'args': ['Test1']}])

    expect(changeRepeatedPassword.called).to.be.true
    expect(changeRepeatedPassword.calls).to.deep.equal([{'args': ['Test2']}])

    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
