import React from 'react'
import { NavigatorContainer } from 'src/NavigatorContainer'
import { shallow } from 'enzyme'
import { RootState } from 'src/reducers/'
const { createReactNavigationReduxMiddleware } = require('react-navigation-redux-helpers')

describe.only('NavigatorContainer', ()=> {
  const COMMON_PROPS = {
    parseJWT: jest.fn(),
    goBack: jest.fn(),
    navigation: {
      index: 0,
      routes: [{routeName: 'Home'}],
      navigate: jest.fn()
    },
    openScanner: jest.fn(),
    handleDeepLink: jest.fn(),
    checkIfAccountExists: jest.fn(),
    dispatch: jest.fn()
  }


  it('mounts correctly and matches snapshot', () => {
    createReactNavigationReduxMiddleware('root', (state : RootState) => state.navigation)
    const navigation = {
      index: 0,
      routes: [{routeName: 'Home'}],
      navigate: jest.fn()
    }
    const homeScreenProps = {...COMMON_PROPS, navigation}

    const rendered = shallow(<NavigatorContainer {...homeScreenProps}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('correctly hides bottom action bar', () => {
    createReactNavigationReduxMiddleware('root', (state : RootState) => state.navigation)
    const navigation = {
      index: 0,
      routes: [{routeName: 'Landing'}],
      navigate: jest.fn()
    }
    const landingPageProps = {...COMMON_PROPS, navigation}

    const rendered = shallow(<NavigatorContainer {...landingPageProps}/>)
    expect(rendered).toMatchSnapshot()
  })
})
