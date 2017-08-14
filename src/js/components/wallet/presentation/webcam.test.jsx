import React from 'react'
import { shallow } from 'enzyme'
import WebCamPresentation from './webcam'

describe.only('(Component) Wallet WebCamPresentation Presentation', () => {
  it('should render properly the first time', () => {
    shallow((<WebCamPresentation
      addPhoto={() => {}}
      cancel={{}}
      deletePhoto={{}}
      photos={[]}
      save={{}} />),
    { context: { muiTheme: { } } })
  })
})
