import React from 'react'

import LegalTextWrapper from './components/LegalTextWrapper'
import { privacyPolicyEN, privacyPolicyDE } from '~/translations/terms'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import useTranslation from '~/hooks/useTranslation'

const PrivacyPolicy = () => {
  const { t, currentLanguage } = useTranslation()

  return (
    <LegalTextWrapper
      locale={currentLanguage}
      title={t('PrivacyPolicy.header')}
      enText={privacyPolicyEN}
      deText={privacyPolicyDE}
    >
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.tiniest}
        customStyles={{
          opacity: 0.2,
          lineHeight: 14,
          marginTop: 72,
        }}
      >
        {t('PrivacyPolicy.footer')}
      </JoloText>
    </LegalTextWrapper>
  )
}
export default PrivacyPolicy
