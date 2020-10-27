import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import SingleSettingView from './SingleSettingView'

const FAQ = () => (
  <SingleSettingView>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      FAQ
    </JoloText>
  </SingleSettingView>
)

export default FAQ
