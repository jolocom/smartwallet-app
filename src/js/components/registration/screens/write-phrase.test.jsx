/* global describe: true, it: true */
import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
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
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('WritePhrase').prop('value')).to.be.empty
    expect(wrapper.find('WritePhrase').prop('isChecked')).to.be.false
  })
})
