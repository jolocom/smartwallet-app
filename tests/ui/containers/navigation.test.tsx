import React from 'react'
import { NavigatorContainer } from 'src/NavigatorContainer'
import { shallow } from 'enzyme'

describe('NavigatorContainer', () => {
  const COMMON_PROPS: Partial<NavigatorContainer['props']> = {
    deepLinkLoading: false,
    initApp: jest.fn(),
    handleDeepLink: jest.fn(),
    checkIfAccountExists: jest.fn(),
  }

  it('mounts correctly and matches snapshot', () => {
    // @ts-ignore
    const props: NavigatorContainer['props'] = {
      ...COMMON_PROPS,
    }

    const rendered = shallow(<NavigatorContainer {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
