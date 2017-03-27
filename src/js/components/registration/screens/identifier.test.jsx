/* global describe: true, it: true */
import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import RegistrationIdentifierScreen from './identifier'

describe('(Component) RegistrationIdentifierScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationIdentifierScreen.WrappedComponent {
        ...RegistrationIdentifierScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            email:  {
              value: '',
              valid: false
            },
             humanName:  {
              value: 'xyz'
            }
          }
        }))
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Identifier').prop('value')).to.be.empty
    expect(wrapper.find('Identifier').prop('userName')).to.be.equal('xyz')
    expect(wrapper.find('Identifier').prop('valid')).to.be.false
  })
})
