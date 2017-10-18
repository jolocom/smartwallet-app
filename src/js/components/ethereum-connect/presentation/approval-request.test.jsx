import React from 'react'
import {shallow} from 'enzyme'
import ApprovalRequest from './approval-request'

describe('(Component) ApprovalRequestPresentation', () => {
  it('should render properly the first time', () => {
    shallow((<ApprovalRequest
      ethereumConnect={{
        loading: false,
        errorMsg: '',
        expanded: false,
        fundsNotSufficient: false,
        requesterName: 'Example',
        contractShortName: 'example',
        methods: '',
        noSecurityVerfication: true,
        securityDetails: [{
          type: 'Contract Ownerhsip',
          text: 'No verified contract owner',
          verified: false
        },
        {
          type: 'Security Audit',
          text: 'This contract is not audited for security',
          verified: false
        },
        {
          type: 'Method Audit',
          text: 'The functionality of this contract is not confirmed',
          verified: false
        }]
      }}
      amount={''}
      toggleSecuritySection={() => {}}
      executeTransaction={() => {}}
      handleDialog={() => {}} />),
    { context: { muiTheme: { } } }
  )
  })
})
