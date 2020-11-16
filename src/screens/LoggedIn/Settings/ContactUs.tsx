import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'
import Dropdown from './components/Dropdown'

const ContactUs: React.FC = () => (
  <ScreenContainer hasHeaderBack>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      Contact us
    </JoloText>
    <Dropdown />
  </ScreenContainer>
)

export default ContactUs
