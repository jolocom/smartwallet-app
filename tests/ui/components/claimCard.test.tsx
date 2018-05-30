import React from 'react'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { shallow } from 'enzyme'

describe('ClaimCard component', ()=> {
  it('matches the snapshot on render', () => {
    const props = {
      claimItem: {
        id: 'ssssfkaca43r',
        claimField: 'name',
        claimValue: 'Kasia',
        category: 'personal'
      },
      openClaimsDetails: () => null
    }
    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot of a two line claim', () => {
    const props = {
      claimItem: {
        id: 'adgdfvkfbvrea43r',
        claimField: 'name',
        claimValue: 'natascha world',
        category: 'personal'
      },
      openClaimsDetails: () => null
    }
    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot of a claim with unspecified icon / uses default icon', () => {
    const props = {
      claimItem: {
        id: 'adgvrea43r',
        claimField: 'favColor',
        claimValue: 'green',
        category: 'other'
      },
      openClaimsDetails: () => null
    }

    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })
})
