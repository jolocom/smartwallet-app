import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import SingleSettingView from './SingleSettingView'

const RateUs = () => (
  <SingleSettingView>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      Rate us
    </JoloText>
  </SingleSettingView>
)

export default RateUs
