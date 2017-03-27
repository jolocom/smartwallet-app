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
  it('should call setEmail onchange with proper params', function() {
    const setEmail = stub()
    const goForward = () => {}
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
    wrapper.find(Presentation).props().onChange('test@test.test')
    expect(setEmail.called).to.be.true
    expect(setEmail.calls).to.deep.equal([{ 'args': [
      'test@test.test'
    ]
    }])
  })
  it('should call goForward onSubmit with proper params', function() {
    const setEmail = () => {}
    const goForward = stub()
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
    wrapper.find(Presentation).props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
