import React from 'react'
import { privacyPolicyEN, privacyPolicyDE } from '~/translations'
import TermsTemplate from './components/TermsAndPrivacyDetails'

const PrivacyPolicy: React.FC = () => (
  <TermsTemplate title={'Privacy Policy'} text={privacyPolicyEN} />
)

export default PrivacyPolicy
