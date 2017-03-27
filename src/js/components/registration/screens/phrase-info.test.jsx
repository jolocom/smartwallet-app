import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationPhraseInfoScreen from './phrase-info'

describe('(Component) RegistrationPhraseInfoScreen', function() {
  it('should call setUserType onChange and goForward onSubmit ' +
    'with proper params', function() {
    const setUserType = stub()
    const goForward = stub()
    const wrapper = shallow(
      (<RegistrationPhraseInfoScreen.WrappedComponent {
        ...RegistrationPhraseInfoScreen.mapStateToProps(Immutable.fromJS({
          registration: { }
        }
        ))
      }
        setUserType={setUserType}
        goForward={goForward}
       />),
      { context: { muiTheme: { } } }
    )
    wrapper.find('PhraseInfo').props().onChange('test')
    expect(setUserType.called).to.be.true
    expect(setUserType.calls).to.deep.equal([{ 'args': [
      'test'
    ]
    }])
    wrapper.find('PhraseInfo').props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
