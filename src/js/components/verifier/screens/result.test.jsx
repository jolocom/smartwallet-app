import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import VerificationResultScreen from './result'
import Presentation from '../presentation/result'

describe('(Component) VerificationResultScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<VerificationResultScreen.WrappedComponent {
        ...VerificationResultScreen.mapStateToProps(Immutable.fromJS({
          verifier: {
            result: {
              loading: true,
              success: false,
              numberOfFails: 0
            }
          }
        }))
      }
        finishVerification={() => {}}
        startDataCheck={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find(Presentation).prop('loading')).to.be.true
  })
  it('should call finishVerification with proper params', () => {
    const finishVerification = stub()
    const wrapper = shallow(
      (<VerificationResultScreen.WrappedComponent {
        ...VerificationResultScreen.mapStateToProps(Immutable.fromJS({
          verifier: {
            result: {
              loading: true,
              success: false,
              numberOfFails: 0
            }
          }
        }))
      }
        finishVerification={finishVerification}
        startDataCheck={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().finishVerification(true)
    expect(finishVerification.called).to.be.true
    expect(finishVerification.calls).to.deep.equal([{args: [true]}])
  })
  it('should call cancelFaceVerification with proper params', () => {
    const startDataCheck = stub()
    const wrapper = shallow(
      (<VerificationResultScreen.WrappedComponent {
        ...VerificationResultScreen.mapStateToProps(Immutable.fromJS({
          verifier: {
            result: {
              loading: true,
              success: false,
              numberOfFails: 0
            }
          }
        }))
      }
        finishVerification={() => {}}
        startDataCheck={startDataCheck}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().startDataCheck()
    expect(startDataCheck.called).to.be.true
    expect(startDataCheck.calls).to.deep.equal([{args: []}])
  })
})
