import React from 'react'
import { shallow } from 'enzyme'
import { ClaimDetailsComponent } from 'src/ui/home/components/claimDetails'

describe('ClaimDetails component', () => {
  it('matches the snapshot on render', () => {
    const props = {
      handleClaimInput: () => {},
      saveClaim: () => {},
      selectedClaim: {
        credentialType: 'Email',
        claimData: {
          email: 'test@test.com'
        }
      }
    }

    const rendered = shallow(<ClaimDetailsComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})