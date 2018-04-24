import React from 'react'
import { LandingContainer } from 'src/ui/landing/containers/landing'
import { shallow } from 'enzyme'

describe('landing container', ()=> {
  it('mounts correctly and matches snapshot', () => {
    const navigate = jest.fn()
    const goToNextScreen = jest.fn()

    const props = {
      navigate
    }

    const rendered = shallow(<LandingContainer {...props}/>)
    expect(rendered).toMatchSnapshot()

    expect(goToNextScreen).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
