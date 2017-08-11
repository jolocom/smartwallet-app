import React from 'react'
import { shallow } from 'enzyme'
import VerificationTransitionPresentation from './transition'

describe('(Component) VerificationTransitionPresentation', function() {
  it('should render properly the first time', function() {
    shallow((<VerificationTransitionPresentation
      startDataCheck={() => {}}
      startFaceCheck={() => {}}
      requestVerification={() => {}}
      goBack={() => {}}
      currentStep="face"
      />),
      { context: { muiTheme: { } } }
    )
  })
})
