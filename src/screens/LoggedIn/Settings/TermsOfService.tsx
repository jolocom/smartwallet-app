import React from 'react'

import LegalTextWrapper from './components/LegalTextWrapper'
import { termsOfServiceEN, termsOfServiceDE } from '~/translations/terms'
import useTranslation from '~/hooks/useTranslation'

const TermsOfService = () => {
  const { t, currentLanguage } = useTranslation()
  return (
    <LegalTextWrapper
      locale={currentLanguage}
      title={t('TermsOfService.header')}
      enText={termsOfServiceEN}
      deText={termsOfServiceDE}
    />
  )
}

export default TermsOfService
