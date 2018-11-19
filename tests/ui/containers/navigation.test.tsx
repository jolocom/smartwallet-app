import React from 'react'
import { NavigatorContainer } from 'src/NavigatorContainer'
import { shallow } from 'enzyme'
import { RootState } from 'src/reducers/'
const { createReactNavigationReduxMiddleware } = require('react-navigation-redux-helpers')

describe.only('NavigatorContainer', ()=> {
  it('mounts correctly and matches snapshot', () => {
    const parseJWT = jest.fn()
    const goBack = jest.fn()

    createReactNavigationReduxMiddleware('root', (state : RootState) => state.navigation)

    const props = {
      parseJWT,
      goBack,
      navigation: { navigate: jest.fn() }
    }

    const rendered = shallow(<NavigatorContainer {...props}/>)
    expect(rendered).toMatchSnapshot()
  })
})
