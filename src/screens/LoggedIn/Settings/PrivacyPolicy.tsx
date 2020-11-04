import React from 'react'

import LegalTextWrapper from './components/LegalTextWrapper'
import { privacyPolicyEN, privacyPolicyDE } from '~/translations/terms'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const PrivacyPolicy = () => (
  <LegalTextWrapper
    locale="en"
    title={strings.PRIVACY_POLICY}
    enText={privacyPolicyEN}
    deText={privacyPolicyDE}
  >
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.tiniest}
      customStyles={{ opacity: 0.2, lineHeight: 14, marginTop: 145 }}
    >
      {strings.PRIVACY_POLICY_QUESTIONS}
    </JoloText>
  </LegalTextWrapper>
)

export default PrivacyPolicy
