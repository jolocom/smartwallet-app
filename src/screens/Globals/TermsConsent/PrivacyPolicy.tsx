import React from 'react'
import { privacyPolicyEN, privacyPolicyDE } from '~/translations'
import TermsTemplate from './components/TermsAndPrivacyDetails'
import useTranslation from '~/hooks/useTranslation'

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation()

  return (
    <TermsTemplate
      title={t('PrivacyPolicy.header')}
      deText={privacyPolicyDE}
      enText={privacyPolicyEN}
    />
  )
}

export default PrivacyPolicy
