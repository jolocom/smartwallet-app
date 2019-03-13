import React from 'react'
import { shallow } from 'enzyme'
import { ClaimDetailsComponent } from 'src/ui/home/components/claimDetails'

describe('ClaimDetails component', () => {
  const COMMON_PROPS = {
    handleClaimInput: () => {},
    saveClaim: () => {},
  }

  it('matches the snapshot on render', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      selectedClaim: {
        credentialType: 'Email',
        claimData: {
          email: 'test@test.com',
        },
      },
    })

    const rendered = shallow(<ClaimDetailsComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot on render with multi-line claim', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      selectedClaim: {
        credentialType: 'Name',
        claimData: {
          givenName: 'natascha',
          familyName: 'test',
        },
      },
    })

    const rendered = shallow(<ClaimDetailsComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
