import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationEntropyScreen from './entropy'

describe.only('(Component) RegistrationEntropyScreen', function() {
  it('should render properly the first time', function() {
    const goForward = stub()
    const setMaskedImageUncovering = stub()
    const addEntropyFromDeltas = stub()
    const wrapper = shallow(
      (<RegistrationEntropyScreen.WrappedComponent {
        ...RegistrationEntropyScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            humanName: {
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
        goForward={goForward}
        setMaskedImageUncovering={setMaskedImageUncovering}
        addEntropyFromDeltas={addEntropyFromDeltas}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Entropy').prop('valid')).to.be.false
    expect(wrapper.find('Entropy').prop('imageUncovering')).to.be.false
    expect(wrapper.find('Entropy').prop('user')).to.equal('xyz')
    wrapper.find('Entropy').props().onSubmit()
    expect(goForward.called).to.be.true
    wrapper.find('Entropy').props().onImagePointUncoverd(2, 2)
    expect(true).to.be.true
  })
})
