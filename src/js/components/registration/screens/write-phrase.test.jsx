import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationWritePhraseScreen from './write-phrase'

describe('(Component) RegistrationWritePhraseScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationWritePhraseScreen.WrappedComponent {
        ...RegistrationWritePhraseScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            passphrase: {
              sufficientEntropy: false,
              progress: 0,
              randomString: '',
              phrase: '',
              writtenDown: false,
              valid: false
            }
          }
        }))
      }
        setUserType={() => {}}
        goForward={() => {}}
        setPassphraseWrittenDown={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('WritePhrase').prop('value')).to.be.empty
    expect(wrapper.find('WritePhrase').prop('isChecked')).to.be.false
  })
  it('should call setPassphraseWrittenDown onToggle', function() {
    const setPassphraseWrittenDown = stub()
    const wrapper = shallow(
      (<RegistrationWritePhraseScreen.WrappedComponent {
        ...RegistrationWritePhraseScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            passphrase: {
              sufficientEntropy: false,
              progress: 0,
              randomString: '',
              phrase: '',
              writtenDown: false,
              valid: false
            }
          }
        }))
      }
        setUserType={() => {}}
        goForward={() => {}}
        setPassphraseWrittenDown={setPassphraseWrittenDown}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WritePhrase').props().onToggle('test')
    expect(setPassphraseWrittenDown.called).to.be.true
    expect(setPassphraseWrittenDown.calls).to.deep.equal([{'args': [{value: 'test'}]}])
  })
  it('should call goForward onSubmit', function() {
    const goForward = stub()
    const wrapper = shallow(
      (<RegistrationWritePhraseScreen.WrappedComponent {
        ...RegistrationWritePhraseScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            passphrase: {
              sufficientEntropy: false,
              progress: 0,
              randomString: '',
              phrase: '',
              writtenDown: false,
              valid: false
            }
          }
        }))
      }
        goForward={goForward}
        setPassphraseWrittenDown={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WritePhrase').props().onSubmit()
    expect(goForward.called).to.be.true
    expect(goForward.calls).to.deep.equal([{'args': []}])
  })
})
