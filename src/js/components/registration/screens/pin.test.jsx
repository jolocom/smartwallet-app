/* global describe: true, it: true */
import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import RegistrationPinScreen from './pin'

describe('(Component) RegistrationPinScreen', function() {
  it('should render properly the first time', function() {
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
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Pin').prop('value')).to.be.empty
    expect(wrapper.find('Pin').prop('focused')).to.be.false
    expect(wrapper.find('Pin').prop('confirm')).to.be.false
    expect(wrapper.find('Pin').prop('valid')).to.be.false
  })
})
