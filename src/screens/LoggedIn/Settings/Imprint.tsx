import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import SingleSettingView from './SingleSettingView'

const Imprint = () => (
  <SingleSettingView>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      Imprint
    </JoloText>
  </SingleSettingView>
)

export default Imprint
