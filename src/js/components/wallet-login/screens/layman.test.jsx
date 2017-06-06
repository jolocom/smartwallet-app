import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import LaymanLoginScreen from './layman'

describe('(Component) LaymanLogin', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<LaymanLoginScreen.WrappedComponent {
        ...LaymanLoginScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            login: {
              username: '',
              password: '',
              failed: false,
              valid: false,
              errorMsg: ''
            }
          }
        }))
      }
        setUsername={() => {}}
        setPassword={() => {}}
        submitLogin={() => {}}
        goToLogin={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('LaymanLogin').prop('username')).to.be.empty
    expect(wrapper.find('LaymanLogin').prop('password')).to.be.empty
  })

  it('should call submitLogin onSubmit with proper params', () => {
    const submitLogin = stub()
    const wrapper = shallow(
      (<LaymanLoginScreen.WrappedComponent {
        ...LaymanLoginScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            login: {
              username: '',
              password: '',
              failed: false,
              valid: false,
              errorMsg: ''
            }
          }
        }))
      }
        setUsername={() => {}}
        setPassword={() => {}}
        submitLogin={submitLogin}
        goToLogin={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('LaymanLogin').props().onSubmit()
    expect(submitLogin.called).to.be.true
  })
  it('should call setUsername setPassword onChange with proper params', () => {
    const setUsername = stub()
    const setPassword = stub()
    const wrapper = shallow(
      (<LaymanLoginScreen.WrappedComponent {
        ...LaymanLoginScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            login: {
              username: '',
              password: '',
              failed: false,
              valid: false,
              errorMsg: ''
            }
          }
        }))
      }
        onUsernameChange={setUsername}
        setPassword={setPassword}
        submitLogin={() => {}}
        goToLogin={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    const e = {target: {value: 'test'}}

    wrapper.find('LaymanLogin').props().onUsernameChange(e)
    expect(setUsername.called).to.be.true
    expect(setUsername.calls).to.deep.equal([{args: [e]}])

    wrapper.find('LaymanLogin').props().onPasswordChange(e)
    expect(setPassword.called).to.be.true
    expect(setPassword.calls).to.deep.equal([{args: [e]}])
  })
})
