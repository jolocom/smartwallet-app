import React from 'react'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { shallow } from 'enzyme'

describe('ClaimCard component', ()=> {
  it('matches the snapshot on render', () => {
    const props = {
      claimType: 'name',
      firstClaimLabel: 'name',
      openClaimsDetails: () => null
    }
    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot of a two line claim', () => {
    const props = {
      claimType: 'name',
      firstClaimLabel: 'first name',
      firstClaimValue: 'natascha',
      claimLines: 2,
      secondClaimLabel: 'last name',
      secondClaimValue: 'xx',
      openClaimsDetails: () => null
    }
    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot of a claim with unspecified icon / uses default icon', () => {
    const props = {
      claimType: 'favColor',
      firstClaimLabel: 'favourite Color',
      firstClaimValue: 'green',
      openClaimsDetails: () => null
    }

    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })
})
