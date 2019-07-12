import React from 'react'
import { NavigatorContainer } from 'src/NavigatorContainer'
import { shallow } from 'enzyme'
import { routeList } from 'src/routeList'

describe('NavigatorContainer', () => {
  const COMMON_PROPS: Partial<NavigatorContainer['props']> = {
    deepLinkLoading: false,
    initApp: jest.fn(),
    handleDeepLink: jest.fn(),
    checkIfAccountExists: jest.fn(),
  }

  it('mounts correctly and matches snapshot', () => {
    const navigation = {
      index: 0,
      routes: [{ routeName: 'Home' }],
      navigate: jest.fn(),
    }

    const props: NavigatorContainer['props'] = {
      ...COMMON_PROPS,
      // @ts-ignore
      navigation,
    }

    const rendered = shallow(<NavigatorContainer {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('correctly hides bottom action bar', () => {
    const navigation = {
      index: 0,
      routes: [{ routeName: routeList.Landing }],
      navigate: jest.fn(),
    }

    const landingPageProps: NavigatorContainer['props'] = {
      ...COMMON_PROPS,
      // @ts-ignore
      navigation,
    }

    const rendered = shallow(<NavigatorContainer {...landingPageProps} />)
    expect(rendered).toMatchSnapshot()
  })
})
