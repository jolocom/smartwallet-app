import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import SingleSettingView from './SingleSettingView'

const About = () => (
  <SingleSettingView>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      About
    </JoloText>
  </SingleSettingView>
)

export default About
