import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import VerificationFaceScreen from './face'
import Presentation from '../presentation/face'

describe('(Component) VerificationFaceScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<VerificationFaceScreen.WrappedComponent {
        ...VerificationFaceScreen.mapStateToProps(Immutable.fromJS({
          verifier: {
            face: {
              isFaceMatchingId: true
            }
          }
        }))
      }
        verifyFace={() => {}}
        cancelFaceVerification={() => {}}
        confirmFaceIdCardMatch={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find(Presentation).prop('isFaceMatchingId')).to.be.true
  })
  it('should call confirmFaceIdCardMatch with proper params', () => {
    const confirmFaceIdCardMatch = stub()
    const wrapper = shallow(
      (<VerificationFaceScreen.WrappedComponent {
        ...VerificationFaceScreen.mapStateToProps(Immutable.fromJS({
          verifier: {
            face: {
              isFaceMatchingId: true
            }
          }
        }))
      }
        verifyFace={() => {}}
        cancelFaceVerification={() => {}}
        confirmFaceIdCardMatch={confirmFaceIdCardMatch}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().confirmMatch(true)
    expect(confirmFaceIdCardMatch.called).to.be.true
    expect(confirmFaceIdCardMatch.calls).to.deep.equal([{args: [true]}])
  })
  it('should call cancelFaceVerification with proper params', () => {
    const cancelFaceVerification = stub()
    const wrapper = shallow(
      (<VerificationFaceScreen.WrappedComponent {
        ...VerificationFaceScreen.mapStateToProps(Immutable.fromJS({
          verifier: {
            face: {
              isFaceMatchingId: true
            }
          }
        }))
      }
        verifyFace={() => {}}
        cancelFaceVerification={cancelFaceVerification}
        confirmFaceIdCardMatch={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().cancel()
    expect(cancelFaceVerification.called).to.be.true
    expect(cancelFaceVerification.calls).to.deep.equal([{args: []}])
  })
  it('should call VerifiyFace with proper params', () => {
    const verifyFace = stub()
    const wrapper = shallow(
      (<VerificationFaceScreen.WrappedComponent {
        ...VerificationFaceScreen.mapStateToProps(Immutable.fromJS({
          verifier: {
            face: {
              isFaceMatchingId: true
            }
          }
        }))
      }
        verifyFace={verifyFace}
        cancelFaceVerification={() => {}}
        confirmFaceIdCardMatch={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().verify()
    expect(verifyFace.called).to.be.true
    expect(verifyFace.calls).to.deep.equal([{args: []}])
  })
})
