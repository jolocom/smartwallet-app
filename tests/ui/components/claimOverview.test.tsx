import React from 'react'
import { ClaimOverview } from 'src/ui/home/components/claimOverview'
import { shallow } from 'enzyme'

describe('ClaimsOverview component', ()=> {
  const COMMON_PROPS = {
    claims: {
      loading: false,
      claims: {
        'Personal' : [{
            displayName: 'Name',
            type: ['Credential', 'ProofOfNameCredential'],
            claims: [{
              id: 'default1',
              name: 'name',
              value: 'name',
            }],
          }],
        'Contact': [{
            displayName: 'E-mail',
            type: ['Credential', 'ProofOfEmailCredential'],
            claims: [{
              id: 'default2',
              name: 'email',
              value: ''
            }],
          },
          {
            displayName: 'Phone',
            type: ['Credential', 'ProofOfMobilePhoneNumberCredential'],
            claims: [{
              id: 'default3',
              name: 'phone',
              value: ''
            }],
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
