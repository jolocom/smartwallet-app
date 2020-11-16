import React, { useState } from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'
import TextArea from './components/TextArea'

const ContactUs = () => {
  const [detailsInput, setDetailsInput] = useState('')
  return (
    <ScreenContainer hasHeaderBack>
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
        Contact us
      </JoloText>
      <TextArea input={detailsInput} setInput={setDetailsInput} />
    </ScreenContainer>
  )
}

export default ContactUs
