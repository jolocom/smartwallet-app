import React from 'react'
import { termsOfServiceEN, termsOfServiceDE } from '~/translations'
import TermsTemplate from './components/TermsAndPrivacyDetails'

const TermsOfService: React.FC = () => (
  <TermsTemplate title={'Terms of Service'} text={termsOfServiceEN} />
)

export default TermsOfService
