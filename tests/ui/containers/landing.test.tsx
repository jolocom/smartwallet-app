import React from 'react'
import { LandingContainer, Landing } from 'src/ui/landing/containers/landing'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { LoadingScreen } from 'src/ui/generic'
import { shallow } from 'enzyme'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('landing container', () => {
  it('mounts correctly and matches snapshot if loading', () => {
    const props = {
      startRegistration: jest.fn(),
      loading: true,
    }

    const rendered = shallow(<LandingContainer {...props} />)
    expect(rendered).toMatchSnapshot()
    expect(props.startRegistration).not.toHaveBeenCalled()

    const childWrapper = rendered.find(LoadingScreen)
    expect(childWrapper).toHaveLength(1)
  })

  it('mounts correctly and matches snapshot if loading is finished', () => {
    const props = {
      startRegistration: jest.fn(),
      loading: false,
    }

    const rendered = shallow(<LandingContainer {...props} />)
    expect(rendered).toMatchSnapshot()
    expect(props.startRegistration).not.toHaveBeenCalled()

    const childWrapper = rendered.find(LandingComponent).dive()
    childWrapper.instance().props.handleButtonTap()
    expect(childWrapper).toHaveLength(1)
  })

  it('correctly connects to redux', () => {
    const initialState = {
      account: {
        loading: {
          loading: true,
        },
      },
    }

    const mockStore = configureStore([thunk])(initialState)
    const rendered = shallow(<Landing store={mockStore} />).find(
      LandingContainer,
    )
    expect(rendered.props()).toMatchSnapshot()
  })
})
