import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationUserTypeScreen from './user-type'

describe('(Component) RegistrationUserTypeScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationUserTypeScreen.WrappedComponent {
        ...RegistrationUserTypeScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            userType: {
              value: '',
              valid: false
            },
            username: {
              value: ''
            }
          }
        }))
      }
        goForward={() => {}}
        setUserType={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
     />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('UserType').prop('value')).to.be.empty
    expect(wrapper.find('UserType').prop('user')).to.be.empty
    expect(wrapper.find('UserType').prop('valid')).to.be.false
  })
  it('should setUserType and goForward onSelect with proper params',
  function() {
    const goForward = stub()
    const setUserType = stub()
    const wrapper = shallow(
      (<RegistrationUserTypeScreen.WrappedComponent {
        ...RegistrationUserTypeScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            userType: {
              value: '',
              valid: false
            },
            username: {
              value: ''
            }
          }
        }))
      }
        goForward={goForward}
        setUserType={setUserType}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('UserType').props().onSelect('layman')
    expect(setUserType.called).to.be.true
    expect(setUserType.calls).to.deep.equal([{'args': ['layman']}])
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
  it('should call showSimpleDialog and configSimpleDialog onSelect with ' +
    'proper params', function() {
    const configSimpleDialog = stub()
    const showSimpleDialog = stub()
    const wrapper = shallow(
      (<RegistrationUserTypeScreen.WrappedComponent {
        ...RegistrationUserTypeScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            userType: {
              value: '',
              valid: false
            },
            username: {
              value: ''
            }
          }
        }))
      }
        goForward={() => {}}
        setUserType={() => {}}
        configSimpleDialog={configSimpleDialog}
        showSimpleDialog={showSimpleDialog}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('UserType').props().onWhySelect('message')
    expect(configSimpleDialog.called).to.be.true
    expect(configSimpleDialog.calls).to.deep.equal([{'args': ['message']}])
    expect(showSimpleDialog.called).to.be.true
    expect(showSimpleDialog.calls).to.deep.equal([{'args': []}])
  })
})
