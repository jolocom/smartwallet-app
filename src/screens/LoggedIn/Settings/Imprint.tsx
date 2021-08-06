import React from 'react'

import LegalTextWrapper from './components/LegalTextWrapper'
import { impressumEN, impressumDE } from '~/translations/terms'
import useTranslation from '~/hooks/useTranslation'

const Imprint = () => {
  const { t, currentLanguage } = useTranslation()

  return (
    <LegalTextWrapper
      enText={impressumEN}
      deText={impressumDE}
      title={t('Settings.imprintBlock')}
      locale={currentLanguage}
    />
  )
}

export default Imprint
