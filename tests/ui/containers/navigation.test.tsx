import React from 'react'
import { NavigatorContainer } from 'src/NavigatorContainer'
import { shallow } from 'enzyme'

describe.only('NavigatorContainer', ()=> {
  it('mounts correctly and matches snapshot', () => {
    const parseJWT = jest.fn()
    const goBack = jest.fn()

    const createReduxBoundAddListener = jest.genMockFromModule('createReduxBoundAddListener')
    jest.mock('createReduxBoundAddListener')

    const props = {
      parseJWT,
      goBack,
      navigation: {
        state: {}
      }
    }

    const rendered = shallow(<NavigatorContainer {...props}/>)
    console.log(rendered, 'rendered')
    // expect(rendered).toMatchSnapshot()
  })

  //handle navigateBack

  //test handleOpenURL and handleNavigation

})
