import React from 'react'
import { privacyPolicyEN, privacyPolicyDE } from '~/translations'
import TermsTemplate from './components/TermsAndPrivacyDetails'

const PrivacyPolicy: React.FC = () => {
  return (
    <TermsTemplate
      titleTerm={'PrivacyPolicy.header'}
      deText={privacyPolicyDE}
      enText={privacyPolicyEN}
    />
  )
}

export default PrivacyPolicy
