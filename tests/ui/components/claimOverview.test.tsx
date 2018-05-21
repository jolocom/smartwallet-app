import React from 'react'
import { ClaimOverviewComponent } from 'src/ui/home/components/claimOverview'
import { shallow } from 'enzyme'

describe('ClaimsOverview component', ()=> {
  const COMMON_PROPS = {
    claims: {
      loading: false,
      savedClaims: {
        claimCategories: ['personal', 'contact'],
        personal: [{
          claimType: 'name',
          category: 'personal'
        }],
        contact: [{
          claimType: 'email',
          category: 'contact'
        }]
      }
    },
    scanning: false,
    onScannerStart: () => null,
    openClaimsDetails: () => null,
  }
  it('matches the snapshot on render', () => {

    const rendered = shallow(<ClaimOverviewComponent {...COMMON_PROPS}/>)
    expect(rendered).toMatchSnapshot()
  })
})
