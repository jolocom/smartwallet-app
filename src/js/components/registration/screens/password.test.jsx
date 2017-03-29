import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationPasswordScreen from './password'

describe('(Component) RegistrationPasswordScreen', function() {
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
      }
        setPassword={() => {}}
        setRepeatedPassword={() => {}}
        goForward={() => {}}
      />),
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
  it('should call setPassword onChangePassword with ' +
    'the proper params', function() {
    const setPassword = stub()
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
          setPassword={setPassword}
          setRepeatedPassword={() => {}}
          goForward={() => {}}
       />),
        { context: { muiTheme: { } } }
      )

    wrapper.find('Password').props().onChangePassword('Test')
    expect(setPassword.called).to.be.true
    expect(setPassword.calls).to.deep.equal([{'args': ['Test']}])
  })
  it('should call changeRepeatedPassword onChangeRepeatedPassword ' +
    'with the proper params', function() {
    const changeRepeatedPassword = stub()
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
          setPassword={() => {}}
          setRepeatedPassword={changeRepeatedPassword}
          goForward={() => {}}
        />),
        { context: { muiTheme: { } } }
      )

    wrapper.find('Password').props().onChangeRepeatedPassword('Test')
    expect(changeRepeatedPassword.called).to.be.true
    expect(changeRepeatedPassword.calls).to.deep.equal([{'args': ['Test']}])
  })
  it('should call goForward onSubmit with proper params', function() {
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
        setPassword={() => {}}
        setRepeatedPassword={() => {}}
        goForward={goForward}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Password').props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
