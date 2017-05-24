import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import ExpertLoginPinScreen from './pin'

describe('(Component) ExpertLoginPinScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<ExpertLoginPinScreen.WrappedComponent {
        ...ExpertLoginPinScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            pin: {
              value: '',
              focused: false,
              failed: false,
              valid: false
            }
          }
        }))
      }
        setPin={() => {}}
        resetPin={() => {}}
        setPinFocused={() => {}}
        goForward={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find('Pin').prop('canSubmit')).to.be.false
    expect(wrapper.find('Pin').prop('failed')).to.be.false
    expect(wrapper.find('Pin').prop('focused')).to.be.false
    expect(wrapper.find('Pin').prop('valid')).to.be.false
    expect(wrapper.find('Pin').prop('value')).to.be.empty
  })
  it('should call setPin onChange', () => {
    const setPin = stub()
    const wrapper = shallow(
      (<ExpertLoginPinScreen.WrappedComponent {
        ...ExpertLoginPinScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            pin: {
              value: '',
              focused: false,
              failed: false,
              valid: false
            }
          }
        }))
      }
        setPin={setPin}
        resetPin={() => {}}
        setPinFocused={() => {}}
        goForward={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').props().onChange('test')
    expect(setPin.called).to.be.true
    expect(setPin.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call resetPin onReset', () => {
    const resetPin = stub()
    const wrapper = shallow(
      (<ExpertLoginPinScreen.WrappedComponent {
        ...ExpertLoginPinScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            pin: {
              value: '',
              focused: false,
              failed: false,
              valid: false
            }
          }
        }))
      }
        setPin={() => {}}
        resetPin={resetPin}
        setPinFocused={() => {}}
        goForward={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').props().onReset()
    expect(resetPin.called).to.be.true
    expect(resetPin.calls).to.deep.equal([{args: []}])
  })
  it('should call setPinFocused onFocusChange', () => {
    const setPinFocused = stub()
    const wrapper = shallow(
      (<ExpertLoginPinScreen.WrappedComponent {
        ...ExpertLoginPinScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            pin: {
              value: '',
              focused: false,
              failed: false,
              valid: false
            }
          }
        }))
      }
        setPin={() => {}}
        resetPin={() => {}}
        setPinFocused={setPinFocused}
        goForward={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').props().onFocusChange()
    expect(setPinFocused.called).to.be.true
    expect(setPinFocused.calls).to.deep.equal([{args: []}])
  })
  it('should call goForward onSubmit', () => {
    const goForward = stub()
    const wrapper = shallow(
      (<ExpertLoginPinScreen.WrappedComponent {
        ...ExpertLoginPinScreen.mapStateToProps(Immutable.fromJS({
          walletLogin: {
            pin: {
              value: '',
              focused: false,
              failed: false,
              valid: false
            }
          }
        }))
      }
        setPin={() => {}}
        resetPin={() => {}}
        setPinFocused={() => {}}
        goForward={goForward}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Pin').props().onSubmit('passphrase', 'Pin')
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{args: ['passphrase', 'Pin']}])
  })
})
