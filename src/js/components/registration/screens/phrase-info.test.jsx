import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationPhraseInfoScreen from './phrase-info'

describe('(Component) RegistrationPhraseInfoScreen', function() {
  it('should render properly the first time', function() {
    shallow(
      (<RegistrationPhraseInfoScreen.WrappedComponent {
        ...RegistrationPhraseInfoScreen.mapStateToProps(Immutable.fromJS({
          registration: { }
        }
        ))
      }
        setUserType={() => {}}
        goForward={() => {}}
       />),
      { context: { muiTheme: { } } }
    )
  })
  it('should call setUserType onChange with proper params', function() {
    const setUserType = stub()
    const wrapper = shallow(
      (<RegistrationPhraseInfoScreen.WrappedComponent {
        ...RegistrationPhraseInfoScreen.mapStateToProps(Immutable.fromJS({
          registration: { }
        }
        ))
      }
        setUserType={setUserType}
        setPassphraseWrittenDown={() => {}}
        goForward={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('PhraseInfo').props().onChange()
    expect(setUserType.called).to.be.true
    expect(setUserType.calls).to.deep.equal([{'args': ['expert']}])
  })
  it('should call setPassphraseWrittenDown onChange with proper params',
  function() {
    const setPassphraseWrittenDown = stub()
    const wrapper = shallow(
      (<RegistrationPhraseInfoScreen.WrappedComponent {
        ...RegistrationPhraseInfoScreen.mapStateToProps(Immutable.fromJS({
          registration: { }
        }
        ))
      }
        setUserType={() => {}}
        setPassphraseWrittenDown={setPassphraseWrittenDown}
        goForward={() => {}}
       />),
      { context: { muiTheme: { } } }
    )
    wrapper.find('PhraseInfo').props().onChange()
    expect(setPassphraseWrittenDown.calls).to.deep.equal([{'args': [false]}])
  })
  it('should call goForward onChange with proper params', function() {
    const goForward = stub()
    const wrapper = shallow(
      (<RegistrationPhraseInfoScreen.WrappedComponent {
        ...RegistrationPhraseInfoScreen.mapStateToProps(Immutable.fromJS({
          registration: { }
        }
        ))
      }
        setUserType={() => {}}
        setPassphraseWrittenDown={() => {}}
        goForward={goForward}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('PhraseInfo').props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
