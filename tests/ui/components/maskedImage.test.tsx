import * as React from 'react'
import { mount, shallow } from 'enzyme'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'

describe('MaskedImage component', ()=> {
  it('matches the snapshot with empty uncovered path string', () => {
    const props = {
      addPoint: (x: number, y: number) => null, 
      drawUpon: () => null 
    }

    const rendered = shallow(<MaskedImageComponent {...props}/>)
    expect(rendered).toMatchSnapshot()
    expect(rendered.state().uncoveredPath).toEqual('')
  })
})