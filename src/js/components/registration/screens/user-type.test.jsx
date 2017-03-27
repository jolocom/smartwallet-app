/* global describe: true, it: true */
import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
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
          humanName: {
            value: ''
          }
          }
        }))
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('UserType').prop('value')).to.be.empty
    expect(wrapper.find('UserType').prop('user')).to.be.empty
    expect(wrapper.find('UserType').prop('valid')).to.be.false
  })
})
