import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationNameEntryScreen from './name-entry'

describe('(Component) RegistrationNameEntryScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: '',
              valid: false
            }
          }
        }))
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('NameEntry').prop('value')).to.be.empty
    expect(wrapper.find('NameEntry').prop('valid')).to.be.false
  })
  it('should call setUsername onChange', function() {
    const setUsername = stub()
    const goForward = () => {}
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: '',
              valid: false
            }
          }
        }))
      }
        setUsername={setUsername}
        goForward={goForward}
     />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('NameEntry').prop('onChange')('test')
    expect(setUsername.called).to.be.true
  })
  it('should call goForward onSubmit with proper params', function() {
    const setUsername = () => {}
    const goForward = stub()
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: '',
              valid: false
            }
          }
        }))
      }
        setUsername={setUsername}
        goForward={goForward}
       />),
      { context: { muiTheme: { } } }
    )
    wrapper.find('NameEntry').props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
