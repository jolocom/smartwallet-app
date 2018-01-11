import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationEntropyScreen from './entropy'

describe('(Component) RegistrationEntropyScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<RegistrationEntropyScreen.WrappedComponent {
        ...RegistrationEntropyScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: 'xyz'
            },
            maskedImage: {
              uncovering: false
            },
            passphrase: {
              sufficientEntropy: false
            }
          }
        }))
      }
        goForward={() => {}}
        setMaskedImageUncovering={() => {}}
        addEntropyFromDeltas={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    /* eslint-disable */
    expect(wrapper.find('Entropy').prop('valid')).to.be.false
    expect(wrapper.find('Entropy').prop('imageUncovering')).to.be.false
    expect(wrapper.find('Entropy').prop('user')).to.equal('xyz')
    /* eslint-enable */
  })
  it('should call submitEntropy onSubmit with the right params', function() {
    const submitEntropy = stub()
    const wrapper = shallow(
      (<RegistrationEntropyScreen.WrappedComponent {
        ...RegistrationEntropyScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: 'xyz'
            },
            maskedImage: {
              uncovering: false
            },
            passphrase: {
              sufficientEntropy: false
            }
          }
        }))
      }
        submitEntropy={submitEntropy}
        setMaskedImageUncovering={() => {}}
        addEntropyFromDeltas={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Entropy').props().onSubmit()
    /* eslint-disable */
    expect(submitEntropy.called).to.be.true
    expect(submitEntropy.calls).to.deep.equal([{'args': []}])
    /* eslint-enable */
  })
  it('should call setMaskedImageUncovering onImageUncoveringChange ' +
    'with the right params', function() {
    const setMaskedImageUncovering = stub()
    const wrapper = shallow(
      (<RegistrationEntropyScreen.WrappedComponent {
        ...RegistrationEntropyScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: 'xyz'
            },
            maskedImage: {
              uncovering: false
            },
            passphrase: {
              sufficientEntropy: false
            }
          }
        }))
      }
        goForward={() => {}}
        setMaskedImageUncovering={setMaskedImageUncovering}
        addEntropyFromDeltas={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('Entropy').props().onImageUncoveringChange(true)
    /* eslint-disable */
    expect(setMaskedImageUncovering.called).to.be.true
    expect(setMaskedImageUncovering.calls).to.deep.equal([{
      args: [
        {value: true}
      ]
    }])
    /* eslint-enable */
  })
})
