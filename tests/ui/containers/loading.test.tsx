import React from 'react'
import { LoadingContainer } from 'src/ui/registration/containers/loading'
import { shallow } from 'enzyme'

describe('loading component', ()=> {
  it('matches the snapshot on render', () => {
    const props = {
      loadingStage: 0,
      loadingStages: ['Stage 1', 'Stage 2', 'Stage 3', ],
    }

    const rendered = shallow(<LoadingContainer {...props}/>)
    expect(rendered).toMatchSnapshot()
  })
})
