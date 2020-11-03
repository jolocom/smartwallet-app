import React from 'react'

import LegalTextWrapper from './components/LegalTextWrapper'
import { privacyPolicyEN, privacyPolicyDE } from './terms'
import { strings } from '~/translations/strings'

const PrivacyPolicy = () => (
  <LegalTextWrapper
    locale="en"
    title={strings.PRIVACY_POLICY}
    enText={privacyPolicyEN}
    deText={privacyPolicyDE}
  />
)

export default PrivacyPolicy
