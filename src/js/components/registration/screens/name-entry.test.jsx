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
            humanName: {
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
  it('should call setHumanName onChange', function() {
    const setHumanName = stub()
    const goForward = () => {}
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            humanName: {
              value: '',
              valid: false
            }
          }
        }))
      }
        setHumanName={setHumanName}
        goForward={goForward}
     />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('NameEntry').prop('onChange')('test')
    expect(setHumanName.called).to.be.true
  })
  it('should call goForward onSubmit with proper params', function() {
    const setHumanName = () => {}
    const goForward = stub()
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            humanName: {
              value: '',
              valid: false
            }
          }
        }))
      }
        setHumanName={setHumanName}
        goForward={goForward}
       />),
      { context: { muiTheme: { } } }
    )
    wrapper.find('NameEntry').props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
