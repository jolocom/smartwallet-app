import React from 'react'
import { termsOfServiceEN, termsOfServiceDE } from '~/translations'
import TermsTemplate from './components/TermsAndPrivacyDetails'

const TermsOfService: React.FC = () => (
  <TermsTemplate
    title={'Terms of Service'}
    deText={termsOfServiceDE}
    enText={termsOfServiceEN}
  />
)

export default TermsOfService
