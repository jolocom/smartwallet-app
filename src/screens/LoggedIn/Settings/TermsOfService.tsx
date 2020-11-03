import React from 'react'

import LegalTextWrapper from './components/LegalTextWrapper'
import { termsOfServiceEN, termsOfServiceDE } from '~/translations/terms'
import { strings } from '~/translations/strings'

const TermsOfService = () => (
  <LegalTextWrapper
    locale="en"
    title={strings.TERMS_OF_SERVICE}
    enText={termsOfServiceEN}
    deText={termsOfServiceDE}
  />
)

export default TermsOfService
