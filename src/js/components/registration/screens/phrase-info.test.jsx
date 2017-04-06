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
        goForward={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('PhraseInfo').props().onChange('test')
    expect(setUserType.called).to.be.true
    expect(setUserType.calls).to.deep.equal([{'args': ['test']}])
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
        goForward={goForward}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('PhraseInfo').props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
