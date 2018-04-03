import * as React from 'react'
import { EntropyComponent } from 'src/ui/registration/components/entropy'

describe('Entropy component', ()=> {
  it('matches the snapshot when not drawn upon and insufficient entropy', () => {
    const props = {
      addPoint: (x: number, y: number) => null,
      drawUpon: () => null,
      submitEntropy: () => null,
      isDrawn: false,
      sufficientEntropy: false
    }
    const rendered = shallow(<EntropyComponent {...props}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot when drawn upon and insufficient entropy', () => {
    const props = {
      addPoint: (x: number, y: number) => null,
      drawUpon: () => null,
      submitEntropy: () => null,
      isDrawn: true,
      sufficientEntropy: false
    }
    const rendered = shallow(<EntropyComponent{...props}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with when drawn upon and sufficient entropy', () => {
    const props = {
      addPoint: (x: number, y: number) => null,
      drawUpon: () => null,
      submitEntropy: () => null,
      isDrawn: true,
      sufficientEntropy: true
    }
    const rendered = shallow(<EntropyComponent{...props}/>)
    expect(rendered).toMatchSnapshot()
  })
})