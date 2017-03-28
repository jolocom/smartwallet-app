import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationPinScreen from './pin'

describe('(Component) RegistrationPinScreen', function() {
  it('should render properly the first time', function() {
    const setPin = () => {}
    const setPinConfirm = () => {}
    const setPinFocused = () => {}
    const submitPin = () => {}
    const wrapper = shallow(
      (<RegistrationPinScreen.WrappedComponent {
        ...RegistrationPinScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            pin: {
              value: '',
              focused: false,
              confirm: false,
              valid: false
            }
          }
        }))
      }
        setPin={setPin}
        setPinConfirm={setPinConfirm}
        setPinFocused={setPinFocused}
        submitPin={submitPin}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Pin').prop('value')).to.be.empty
    expect(wrapper.find('Pin').prop('focused')).to.be.false
    expect(wrapper.find('Pin').prop('confirm')).to.be.false
    expect(wrapper.find('Pin').prop('valid')).to.be.false
  })
  it('should call setPin onChange with proper params', function() {
    const setPin = stub()
    const setPinConfirm = () => {}
    const setPinFocused = () => {}
    const submitPin = () => {}
    const wrapper = shallow(
      (<RegistrationPinScreen.WrappedComponent {
        ...RegistrationPinScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            pin: {
              value: '',
              focused: false,
              confirm: false,
              valid: false
            }
          }
        }))
      }
        setPin={setPin}
        setPinConfirm={setPinConfirm}
        setPinFocused={setPinFocused}
        submitPin={submitPin}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').prop('onChange')(1234)
    expect(setPin.called).to.be.true
    expect(setPin.calls).to.deep.equal([{'args': [1234]}])
  })
  it('should call setPin and setPinConfirm ' +
    'onChangeRequest with proper params', function() {
    const setPin = stub()
    const setPinConfirm = stub()
    const setPinFocused = () => {}
    const submitPin = () => {}
    const wrapper = shallow(
      (<RegistrationPinScreen.WrappedComponent {
        ...RegistrationPinScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            pin: {
              value: '',
              focused: false,
              confirm: false,
              valid: false
            }
          }
        }))
      }
        setPin={setPin}
        setPinConfirm={setPinConfirm}
        setPinFocused={setPinFocused}
        submitPin={submitPin}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').prop('onChangeRequest')()
    expect(setPin.called).to.be.true
    expect(setPin.calls).to.deep.equal([{'args': ['']}])
    expect(setPinConfirm.called).to.be.true
    expect(setPinConfirm.calls).to.deep.equal([{'args': [false]}])
  })
  it('should call setPinFocused onFocusChange with proper params', function() {
    const setPin = () => {}
    const setPinConfirm = () => {}
    const setPinFocused = stub()
    const submitPin = () => {}
    const wrapper = shallow(
      (<RegistrationPinScreen.WrappedComponent {
        ...RegistrationPinScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            pin: {
              value: '',
              focused: false,
              confirm: false,
              valid: false
            }
          }
        }))
      }
        setPin={setPin}
        setPinConfirm={setPinConfirm}
        setPinFocused={setPinFocused}
        submitPin={submitPin}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').prop('onFocusChange')()
    expect(setPinFocused.called).to.be.true
    expect(setPinFocused.calls).to.deep.equal([{'args': []}])
  })
  it('should call submitPin onSubmit with proper params', function() {
    const setPin = () => {}
    const setPinConfirm = () => {}
    const setPinFocused = () => {}
    const submitPin = stub()
    const wrapper = shallow(
      (<RegistrationPinScreen.WrappedComponent {
        ...RegistrationPinScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            pin: {
              value: '',
              focused: false,
              confirm: false,
              valid: false
            }
          }
        }))
      }
        setPin={setPin}
        setPinConfirm={setPinConfirm}
        setPinFocused={setPinFocused}
        submitPin={submitPin}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').prop('onSubmit')()
    expect(submitPin.called).to.be.true
    expect(submitPin.calls).to.deep.equal([{'args': []}])
  })
})
