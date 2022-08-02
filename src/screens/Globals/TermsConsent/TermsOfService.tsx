import React from 'react'
import { termsOfServiceEN, termsOfServiceDE } from '~/translations'
import TermsTemplate from './components/TermsAndPrivacyDetails'

const TermsOfService: React.FC = () => {
  return (
    <TermsTemplate
      titleTerm={'TermsOfService.header'}
      deText={termsOfServiceDE}
      enText={termsOfServiceEN}
    />
  )
}

export default TermsOfService
