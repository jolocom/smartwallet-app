import React from 'react'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { shallow } from 'enzyme'

describe('ClaimCard component', ()=> {
  it('matches the snapshot on render', () => {
    const props = {
      claimItem: {
        claimField: 'name',
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
        claimField: 'name',
        category: 'personal',
        claimValue: 'natascha world'
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
        category: 'other',
        claimField: 'favColor',
        claimValue: 'green'
      },
      openClaimsDetails: () => null
    }

    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })
})
