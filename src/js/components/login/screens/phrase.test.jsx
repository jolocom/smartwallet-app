import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import ExpertLoginPassphraseScreen from './phrase'

describe('(Component) ExpertLoginPassphraseScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<ExpertLoginPassphraseScreen.WrappedComponent {
        ...ExpertLoginPassphraseScreen.mapStateToProps(Immutable.fromJS({
          login: {
            passphrase: {
              value: '',
              failed: false
            }
          }
        }))
      }
        submitPassphrase={() => {}}
        setPassphrase={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Passphrase').prop('value')).to.be.empty
    expect(wrapper.find('Passphrase').prop('canSubmit')).to.be.false
  })

  it('should call submitPassphrase onSubmit with proper params', () => {
    const submitPassphrase = stub()
    const wrapper = shallow(
      (<ExpertLoginPassphraseScreen.WrappedComponent {
        ...ExpertLoginPassphraseScreen.mapStateToProps(Immutable.fromJS({
          login: {
            passphrase: {
              value: 'test',
              failed: false
            }
          }
        }))
      }
        submitPassphrase={submitPassphrase}
        setPassphrase={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Passphrase').props().onSubmit('test')
    expect(submitPassphrase.called).to.be.true
    expect(submitPassphrase.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call setPassphrase onChange with proper params', () => {
    const setPassphrase = stub()
    const wrapper = shallow(
      (<ExpertLoginPassphraseScreen.WrappedComponent {
        ...ExpertLoginPassphraseScreen.mapStateToProps(Immutable.fromJS({
          login: {
            passphrase: {
              value: 'test',
              failed: false
            }
          }
        }))
      }
        submitPassphrase={() => {}}
        setPassphrase={setPassphrase}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Passphrase').props().onChange('test')
    expect(setPassphrase.called).to.be.true
    expect(setPassphrase.calls).to.deep.equal([{args: ['test']}])
  })
})
