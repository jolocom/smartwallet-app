import React from 'react'
import { ClaimOverview } from 'src/ui/home/components/claimOverview'
import { shallow } from 'enzyme'

describe('ClaimsOverview component', ()=> {
  const COMMON_PROPS = {
    claims: {
      loading: false,
      decoratedCredentials: {
        'Personal' : [{
          credentialType: 'Name',
          claimData: {
            firstName: 'Hello',
            lastName: 'World'
          },
          id: 'claimTestId#1',
          issuer: 'did:jolo:test',
          subject: 'did:jolo:test'
        }],
        'Contact': [{
          credentialType: 'Email',
          claimData: {
            email: 'test@test.de'
          },
          id: 'claimTestId#2',
          issuer: 'did:jolo:test',
          subject: 'did:jolo:test'
        }, {
          credentialType: 'Phone',
          claimData: {
            phone: '999111'
          },
          id: 'claimTestId#3',
          issuer: 'did:jolo:test',
          subject: 'did:jolo:test'
        }]
      }
    },
    scanning: false,
    onScannerStart: () => null,
    openClaimsDetails: () => null,
  }

  it('matches the snapshot on render', () => {

    const rendered = shallow(<ClaimOverview {...COMMON_PROPS}/>)
    expect(rendered).toMatchSnapshot()
  })
})
