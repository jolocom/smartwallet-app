import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationIdentifierScreen from './identifier'
import Presentation from '../presentation/identifier'

describe.only('(Component) RegistrationIdentifierScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationIdentifierScreen.WrappedComponent {
        ...RegistrationIdentifierScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            email: {
              value: '',
              valid: false
            }
          }
        }))
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Identifier').prop('value')).to.be.empty
    expect(wrapper.find('Identifier').prop('valid')).to.be.false
  })
  it('should call setEmail onchange', function() {
    const setEmail = stub()
    function goForward() { }
    const wrapper = shallow(
      (<RegistrationIdentifierScreen.WrappedComponent {
        ...RegistrationIdentifierScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            email: {
              value: '',
              valid: false
            }
          }
        }))
      }
        setEmail={setEmail}
        goForward={goForward}
       />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().onChange('ha@gmail.com')
    expect(setEmail.called).to.be.true
    expect(setEmail.calls).to.deep.equal([{ 'args': [
      'ha@gmail.com'
    ]
    }])
  })
})
