import React from 'react'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { shallow } from 'enzyme'

describe('ClaimCard component', ()=> {
  it('matches the snapshot on render', () => {
    const props = {
      claimItem: {
        displayName: 'Name',
        type: ['Credential', 'ProofOfNameCredential'],
        claims: [{
          id: 'default1',
          name: 'name',
          value: 'Kasia',
        }],
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
        displayName: 'Name',
        type: ['Credential', 'ProofOfNameCredential'],
        claims: [{
          id: 'default1',
          name: 'name',
          value: 'Natascha World',
        }],
      },
      openClaimsDetails: () => null
    }
    const rendered = shallow(<ClaimCard
      {...props}
    />)
    expect(rendered).toMatchSnapshot()
  })
})
