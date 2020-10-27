import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import SingleSettingView from './SingleSettingView'

const ContactUs = () => (
  <SingleSettingView>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      Contact us
    </JoloText>
  </SingleSettingView>
)

export default ContactUs
