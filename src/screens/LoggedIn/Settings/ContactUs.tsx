import React, { useState, useMemo } from 'react'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations/strings'
import { JoloTextSizes } from '~/utils/fonts'
import Dropdown from './components/Dropdown'
import TextArea from './components/TextArea'

const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const ContactUs: React.FC = () => {
  const [detailsInput, setDetailsInput] = useState('')
  const options = useMemo(
    () =>
      INQUIRIES_LIST.map((el) => ({ id: el.split(' ').join(''), value: el })),
    [],
  )
  return (
    <ScreenContainer hasHeaderBack>
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
        Contact us
      </JoloText>
      <TextArea input={detailsInput} setInput={setDetailsInput} />
      <Dropdown options={options} />
    </ScreenContainer>
  )
}

export default ContactUs
