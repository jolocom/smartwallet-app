import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import LoginUserTypeScreen from './user-type'

describe('(Component) LoginUserTypeScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<LoginUserTypeScreen.WrappedComponent {
        ...LoginUserTypeScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            userType: {
              value: '',
              valid: false
            }
          }
        }))
      }
        setUserType={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
     />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('UserType').prop('value')).to.be.empty
    expect(wrapper.find('UserType').prop('valid')).to.be.false
  })
  it('should setUserType with proper params',
  function() {
    const setUserType = stub()
    const wrapper = shallow(
      (<LoginUserTypeScreen.WrappedComponent {
        ...LoginUserTypeScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            userType: {
              value: '',
              valid: false
            }
          }
        }))
      }
        setUserType={setUserType}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('UserType').props().onSelect('layman')
    expect(setUserType.called).to.be.true
    expect(setUserType.calls).to.deep.equal([{'args': ['layman']}])
  })
  it('should call showSimpleDialog and configSimpleDialog onSelect with ' +
    'proper params', function() {
    const configSimpleDialog = stub()
    const showSimpleDialog = stub()
    const wrapper = shallow(
      (<LoginUserTypeScreen.WrappedComponent {
        ...LoginUserTypeScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            userType: {
              value: '',
              valid: false
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
    expect(configSimpleDialog.calls).to.deep.equal([{'args': [
      null,
      'message',
      'OK',
      {},
      true
    ]}])
    expect(showSimpleDialog.called).to.be.true
    expect(showSimpleDialog.calls).to.deep.equal([{'args': []}])
  })
})
