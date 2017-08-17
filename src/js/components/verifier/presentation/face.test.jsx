import React from 'react'
import { shallow } from 'enzyme'
import VerificationFacePresentation from './face'

describe('(Component) VerificationFacePresentation', function() {
  it('should render properly the first time', function() {
    shallow((<VerificationFacePresentation
      verify={() => {}}
      cancel={() => {}}
      confirmMatch={() => {}}
      isFaceMatchingId />),
      { context: { muiTheme: { } } }
    )
  })
})
