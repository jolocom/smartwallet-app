import React from 'react'
import { shallow } from 'enzyme'
import { ClaimDetailsContainer } from 'src/ui/home/containers/claimDetails'

describe('ClaimDetails container', () => {
  const COMMON_PROPS = {
    claims: {
      selected: {
        credentialType: 'Email',
        claimData: {
          email: 'test@test.com'
        }
      }
    },
    handleClaimInput: () => {},
    saveClaim: () => {}
  }

  it('mounts correctly and matches the snapshot', () => {
    const rendered = shallow(<ClaimDetailsContainer {...COMMON_PROPS} />)
    expect(rendered).toMatchSnapshot()
  })
})
