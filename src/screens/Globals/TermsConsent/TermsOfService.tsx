import React from 'react'
import { termsOfServiceEN, termsOfServiceDE } from '~/translations'
import TermsTemplate from './components/TermsAndPrivacyDetails'
import useTranslation from '~/hooks/useTranslation'

const TermsOfService: React.FC = () => {
  const { t } = useTranslation()

  return (
    <TermsTemplate
      titleTerm={'TermsOfService.header'}
      deText={termsOfServiceDE}
      enText={termsOfServiceEN}
    />
  )
}

export default TermsOfService
