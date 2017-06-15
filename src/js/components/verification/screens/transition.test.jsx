import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import VerificationTransitionScreen from './transition'
import Presentation from '../presentation/transition'

describe('(Component) VerificationTransitionScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<VerificationTransitionScreen.WrappedComponent {
        ...VerificationTransitionScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            transition: {
              currentStep: 'face'
            }
          }
        }))
      }
        goBack={() => {}}
        startDataCheck={() => {}}
        startFaceCheck={() => {}}
        requestVerification={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find(Presentation).prop('currentStep')).to.equal('face')
  })
  it('should call goBack with proper params', () => {
    const goBack = stub()
    const wrapper = shallow(
      (<VerificationTransitionScreen.WrappedComponent {
        ...VerificationTransitionScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            transition: {
              currentStep: 'face'
            }
          }
        }))
      }
        goBack={goBack}
        startDataCheck={() => {}}
        startFaceCheck={() => {}}
        requestVerification={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().goBack()
    expect(goBack.called).to.be.true
    expect(goBack.calls).to.deep.equal([{args: ['face']}])
  })
  it('should call startDataCheck with proper params', () => {
    const startDataCheck = stub()
    const wrapper = shallow(
      (<VerificationTransitionScreen.WrappedComponent {
        ...VerificationTransitionScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            transition: {
              currentStep: 'face'
            }
          }
        }))
      }
        goBack={() => {}}
        startDataCheck={startDataCheck}
        startFaceCheck={() => {}}
        requestVerification={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().startDataCheck()
    expect(startDataCheck.called).to.be.true
    expect(startDataCheck.calls).to.deep.equal([{args: []}])
  })
  it('should call startFaceCheck with proper params', () => {
    const startFaceCheck = stub()
    const wrapper = shallow(
      (<VerificationTransitionScreen.WrappedComponent {
        ...VerificationTransitionScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            transition: {
              currentStep: 'face'
            }
          }
        }))
      }
        goBack={() => {}}
        startDataCheck={() => {}}
        startFaceCheck={startFaceCheck}
        requestVerification={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().startFaceCheck('test')
    expect(startFaceCheck.called).to.be.true
    expect(startFaceCheck.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call requestVerification with proper params', () => {
    const requestVerification = stub()
    const wrapper = shallow(
      (<VerificationTransitionScreen.WrappedComponent {
        ...VerificationTransitionScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            transition: {
              currentStep: 'face'
            }
          }
        }))
      }
        goBack={() => {}}
        startDataCheck={() => {}}
        startFaceCheck={() => {}}
        requestVerification={requestVerification}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().requestVerification('test')
    expect(requestVerification.called).to.be.true
    expect(requestVerification.calls).to.deep.equal([{args: ['test']}])
  })
})
