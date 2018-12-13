import React from 'react'
import { shallow } from 'enzyme'
import { ClaimsContainer } from 'src/ui/home/containers/claims'


describe('Claims container', () => {
  const COMMON_PROPS = {
    scanning: false,
    showClaimsDetails: false,
    typeClaimDetails: '',
    claims: {},
    toggleLoading: () => {}
  }

  it('mounts correctly and matches the snapshot', () => {
    const setClaimsForDid = jest.fn()

    const props = Object.assign({}, COMMON_PROPS {
      setClaimsForDid
    })

    const rendered = shallow(<ClaimsContainer {...props}/>)

    expect(rendered).toMatchSnapshot()
    expect(setClaimsForDid).toHaveBeenCalledTimes(1)
    })
})
