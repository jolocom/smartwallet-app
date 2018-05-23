import React from 'react'
import { LandingContainer, Landing } from 'src/ui/landing/containers/landing'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { shallow } from 'enzyme'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('landing container', ()=> {
  it('mounts correctly and matches snapshot', () => {
    const props = {
      startRegistration: jest.fn(),
      checkIfAccountExists: jest.fn()
    }

    const rendered = shallow(<LandingContainer {...props}/>)
    expect(rendered).toMatchSnapshot()

    expect(props.checkIfAccountExists).toHaveBeenCalledTimes(1)
    expect(props.startRegistration).not.toHaveBeenCalled()

    const childWrapper = rendered.find(LandingComponent).dive()
    childWrapper.instance().props.handleButtonTap()

    expect(props.startRegistration).toHaveBeenCalledTimes(1)
  })

  it('correctly connects to redux', () => {
    const mockStore = configureStore()({})
    const rendered = shallow(<Landing store={ mockStore }/>).find(LandingContainer)
    expect(rendered.props()).toMatchSnapshot()
  })
})
