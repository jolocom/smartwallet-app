/* global describe: true, it: true */
import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import RegistrationPasswordScreen from './password'

describe('(Component) RegistrationPasswordScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationPasswordScreen.WrappedComponent {
        ...RegistrationPasswordScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            password:  {
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
})
