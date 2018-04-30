import React from 'react'
import { shallow } from 'enzyme'
import { EntropyComponent } from 'src/ui/registration/components/entropy'

describe('Entropy component', ()=> {
  const props = {
    addPoint: (x: number, y: number) => null,
    submitEntropy: () => null,
  }

  it('matches the snapshot when not drawn upon and insufficient entropy', () => {
    const rendered = shallow(<EntropyComponent {...props} progress={0} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot when drawn upon and insufficient entropy', () => {
    const rendered = shallow(<EntropyComponent {...props} progress={0.5} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with when drawn upon and sufficient entropy', () => {
    const rendered = shallow(<EntropyComponent {...props} progress={1} />)
    expect(rendered).toMatchSnapshot()
  })
})
