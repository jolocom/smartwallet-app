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
    /* eslint-enable */
  })
  it('should call goForward onSubmit with the right params', function() {
    const goForward =  stub()
    const wrapper = shallow(
      (<RegistrationEntropyScreen.WrappedComponent {
        ...RegistrationEntropyScreen.mapStateToProps(Immutable.fromJS({
          registration: {
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

    console.log(wrapper.find('Entropy').props())
    wrapper.find('Entropy').props().onSubmit()
    /* eslint-disable */
    expect(goForward.called).to.be.false
    /* eslint-enable */
  })
  it('should call setMaskedImageUncovering onImageUncoveringChange ' +
    'with the right params', function() {
    const setMaskedImageUncovering = stub()
    const wrapper = shallow(
      (<RegistrationEntropyScreen.WrappedComponent {
        ...RegistrationEntropyScreen.mapStateToProps(Immutable.fromJS({
          registration: {
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
