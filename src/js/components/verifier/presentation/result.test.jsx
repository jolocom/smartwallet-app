import React from 'react'
import { shallow } from 'enzyme'
import VerificationResultPresentation from './result'

describe('(Component) VerificationResultPresentation', function() {
  it('should render properly the first time', function() {
    shallow((<VerificationResultPresentation
      loading
      success
      numberOfFails={0}
      startDataCheck={() => {}}
      finishVerification={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
