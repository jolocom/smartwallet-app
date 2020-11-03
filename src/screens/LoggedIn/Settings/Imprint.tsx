import React from 'react'

import LegalTextWrapper from './components/LegalTextWrapper'
import { impressumEN, impressumDE } from './terms'
import { strings } from '~/translations/strings'

const Imprint = () => (
  <LegalTextWrapper
    enText={impressumEN}
    deText={impressumDE}
    title={strings.IMPRINT}
    locale="en"
  />
)

export default Imprint
